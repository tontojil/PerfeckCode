// Banner Perfeck para opencode v2.
// SDK oficial V2 con Plugin.define. Imprime al cargar.
import { Plugin } from "@opencode/plugin";

var ROSA = "\x1b[38;2;240;83;140m";
var RESET = "\x1b[0m";
var LINEA = "\u273F Perfeck \u00B7 espa\u00F1ol neutro \u00B7 code-first \u00B7 /verify antes de listo";

function mostrarBanner() {
  console.log("");
  console.log(ROSA + "  _____         _        ___ _ _ " + RESET);
  console.log(ROSA + " |_   _|__ _ __| |_ ___ |_ (_) |" + RESET);
  console.log(ROSA + "   | |/ _ \\ '_ \\ __/ _ \\ | | | |" + RESET);
  console.log(ROSA + "   | |  __/ | | | || (_) || | | |" + RESET);
  console.log(ROSA + "   |_|\\___|_| |_|\\__\\___/ |_|_|_|" + RESET);
  console.log(ROSA + "  " + LINEA + RESET);
  console.log("");
}

export default Plugin.define({
  id: "perfeck-banner",
  async setup() {
    mostrarBanner();
  }
});
