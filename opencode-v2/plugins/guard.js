// Guard Perfeck para opencode v2.
// SDK oficial V2 con Plugin.define. Equivalente a hooks Claude protect-tests + validate-safe-ops.
import { existsSync } from "node:fs";
import { Plugin } from "@opencode/plugin";
import {
  findSecretLabels,
  isTestPath,
  resolveWorkspacePath,
  secretInputText,
  testTargetPaths,
} from "./perfeckcode/safety.ts";

var MENSAJE_DESTRUCTIVO = "Bloqueado por guard Perfeck: comando destructivo o secreto";
var MENSAJE_TEST = "Bloqueado por guard Perfeck: edicion de test existente. Indique que test, por que y que queda cubierto.";
var MENSAJE_SECRETO = "Bloqueado por guard Perfeck: posible credencial privada";

function esBloqueado(cmd) {
  if (!cmd || typeof cmd !== "string") return false;
  var t = cmd;
  if (t.indexOf("rm -rf /") !== -1) return true;
  if (t.indexOf("rm -rf /*") !== -1) return true;
  if (t.indexOf("sudo rm") !== -1) return true;
  if (t.indexOf("mkfs") !== -1) return true;
  if (t.indexOf(":(){:|:&};:") !== -1) return true;
  if (t.indexOf(":|:&") !== -1) return true;
  if (t.indexOf(">") !== -1) {
    if (t.indexOf(".env") !== -1) return true;
    if (t.indexOf("secrets/") !== -1) return true;
  }
  return false;
}

function extraerComando(event) {
  var input = event && event.input;
  if (!input || typeof input !== "object") {
    if (typeof event === "string") return event;
    return "";
  }
  var c = input.command || input.cmd || input.input || input.text || input.filePath || input.path;
  if (typeof c === "string") return c;
  return "";
}

function directorioBase(ctx) {
  var location = ctx && ctx.location;
  if (!location || typeof location.directory !== "string") return "";
  return location.directory;
}

// Solo lectura: existsSync no abre ni modifica el archivo.
function testExistente(ctx, tool, input) {
  var paths = testTargetPaths(tool, input);
  if (paths.length === 0) return false;
  var base = directorioBase(ctx);
  for (var i = 0; i < paths.length; i++) {
    if (!isTestPath(paths[i])) continue;
    var full = resolveWorkspacePath(base, paths[i]);
    if (!full) return true;
    if (existsSync(full)) return true;
  }
  return false;
}

// El mensaje solo expone etiquetas; nunca el texto detectado ni fragmentos.
function rechazarCredenciales(tool, input) {
  var labels = findSecretLabels(secretInputText(tool, input));
  if (labels.length === 0) return;
  throw new Error(MENSAJE_SECRETO + " (" + labels.join(", ") + "). Revise el contenido antes de proceder.");
}

export default Plugin.define({
  id: "perfeck-guard",
  async setup(ctx) {
    await ctx.tool.hook("execute.before", function (event) {
      if (!event || typeof event.tool !== "string") return;
      var tool = event.tool.toLowerCase();
      var input = event.input || {};
      if (tool === "shell" || tool === "bash") {
        if (esBloqueado(extraerComando(event))) {
          throw new Error(MENSAJE_DESTRUCTIVO);
        }
        rechazarCredenciales(tool, input);
        return;
      }
      if (tool === "patch" || tool.indexOf("patch") !== -1) {
        if (testExistente(ctx, tool, input)) {
          throw new Error(MENSAJE_TEST);
        }
        rechazarCredenciales(tool, input);
        return;
      }
      if (tool === "edit" || tool === "write" || tool.indexOf("edit") !== -1 || tool.indexOf("write") !== -1) {
        if (testExistente(ctx, tool, input)) {
          throw new Error(MENSAJE_TEST);
        }
        rechazarCredenciales(tool, input);
      }
    });
  }
});
