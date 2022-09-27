inkscape_path = "C:\\Program Files\\Inkscape\\bin\\inkscape.exe"
import glob
import subprocess
import os
import json 

def start_inkscape(file):
    subprocess.Popen([inkscape_path, file])

boards_svg=glob.glob("..\\boards\\*.svg")
components_directories=[d for d in os.listdir("..\\apps\\") if os.path.isdir(d)]

print("---- Boards ---")
f = open("../boards/boards.json")
boards = json.load(f)
print(boards)
f.close()

for board in boards_svg:
    print("--- Boards ---")
    print(board)
    start_inkscape(board)

for component in components_directories:
    print("--- Thumbnail ---")
    print("..\\apps\\" + component + "\\thumbnail_" + component + ".svg") 
    start_inkscape("..\\apps\\" + component + "\\thumbnail_" + component + ".svg")

for component in components_directories:
    for board in boards.keys():
        print("--- Schematics ---")
        print("..\\apps\\" + component + "\\boards\\" + board + "\\" + board + "_" + component + ".svg")
        start_inkscape("..\\apps\\" + component + "\\boards\\" + board + "\\" + board + "_" + component + ".svg")




