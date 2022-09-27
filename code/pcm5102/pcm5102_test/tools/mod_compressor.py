import os

def convertToProgMem(filename, varname, new_filename):

  print(filename + "==> " + new_filename)
  # Generate hex_str
  hex_str = "const unsigned char " + varname + "[] PROGMEM={"
  with open(filename, 'rb') as f:
      block = f.read()
      for ch in block:
            hex_str += hex(ch) + ", "
  progmem_final = hex_str + "};"
  print(progmem_final)
  with open(new_filename,'w', encoding="utf-8") as progmem_file:
    progmem_file.write(progmem_final)

convertToProgMem("sylvan.mod", "SYLVAN", "../src/sylvan.h")
print("... Done!")