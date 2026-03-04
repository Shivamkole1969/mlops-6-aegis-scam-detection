import os
import subprocess

def push_to_hf():
    run_cmd("git add .")
    run_cmd('git commit -m "Revamp UI with Lusion-like 3D animations and resolve asset paths"')
    run_cmd("git push origin main")
    run_cmd("git push huggingface main")

def run_cmd(cmd):
    print(f"Running: {cmd}")
    subprocess.run(cmd, shell=True)

if __name__ == "__main__":
    push_to_hf()
