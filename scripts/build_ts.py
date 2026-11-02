"""
The Fallen Kingdom - TypeScript Compiler & Bundler via Native esbuild
Compiles all TypeScript source files in src/ into target JavaScript for the browser.
"""

import os
import sys
import subprocess

ESBUILD_PATH = r"C:\Users\felip\AppData\Local\Programs\Antigravity IDE\resources\app\node_modules\@esbuild\win32-x64\esbuild.exe"
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SRC_DIR = os.path.join(ROOT_DIR, "src")
OUT_DIR = os.path.join(ROOT_DIR, "AntiGravity", "js")

def compile_ts_module(entry_path, out_path, bundle=False):
    if not os.path.exists(ESBUILD_PATH):
        print(f"[Error] esbuild not found at {ESBUILD_PATH}", file=sys.stderr)
        return False

    cmd = [
        ESBUILD_PATH,
        entry_path,
        f"--outfile={out_path}",
        "--target=es2022",
        "--charset=utf8"
    ]
    if bundle:
        cmd.extend(["--bundle", "--format=iife", "--global-name=MedievalSurvivors"])

    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"[Failed] {entry_path} -> {out_path}:\n{res.stderr}", file=sys.stderr)
        return False
    print(f"[Compiled] {os.path.relpath(entry_path, ROOT_DIR)} -> {os.path.relpath(out_path, ROOT_DIR)}")
    return True

def compile_all():
    print(f"=== Compilador TypeScript (Native esbuild) ===")
    ts_files = []
    for root, _, files in os.walk(SRC_DIR):
        for f in files:
            if f.endswith(".ts") and not f.endswith(".d.ts") and not "types" in root:
                ts_files.append(os.path.join(root, f))

    success = 0
    for ts in ts_files:
        rel = os.path.relpath(ts, SRC_DIR)
        out_name = os.path.splitext(os.path.basename(ts))[0] + ".js"
        out_target = os.path.join(OUT_DIR, out_name)
        if compile_ts_module(ts, out_target):
            success += 1

    print(f"Compilação concluída: {success}/{len(ts_files)} arquivos compilados com sucesso.")
    return success == len(ts_files)

if __name__ == "__main__":
    compile_all()

