import os
import json

# Define the list of files and folders to ignore
ignore_list = []

def get_directory_structure(root_dir, ignore_list):
    directory_structure = {}

    for item in os.listdir(root_dir):
        if item in ignore_list:
            continue
        
        item_path = os.path.join(root_dir, item)
        
        if os.path.isdir(item_path):
            # If it's a directory, recursively call the function
            directory_structure[item] = get_directory_structure(item_path, ignore_list)
        elif os.path.isfile(item_path):
            # If it's a file, read the content and store it with utf-8 encoding
            try:
                with open(item_path, 'r', encoding='utf-8') as file:
                    # directory_structure[item] = ''
                    directory_structure[item] = file.read()
            except UnicodeDecodeError:
                # Handle files that cannot be decoded with utf-8
                directory_structure[item] = "Unable to decode file with utf-8 encoding."
    
    return directory_structure

# Specify the directory you want to scan
root_directory = r'C:\Users\vinay\OneDrive\Desktop\React Trials\FlowTile\src'

# Get the directory structure
result = get_directory_structure(root_directory, ignore_list)

# Convert the result to JSON
result_json = json.dumps(result, indent=4)

# Save the JSON to a file
with open('directory_structure.json', 'w') as json_file:
    json_file.write(result_json)

print("Directory structure saved to directory_structure.json")
