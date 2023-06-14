import os
import json

content_path = "./content"
pages_path = "./pages"

# Function to get all paths of files with a specific extension in a directory
def get_file_paths(directory, extension):
    file_paths = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(extension):
                file_path = os.path.join(root, file)
                file_paths.append(file_path)
    return file_paths

# Function to generate the JavaScript object and HTML file
def generate_js_object_and_html(folder_path):
    js_object = {}
    for folder in os.listdir(folder_path):
        folder_dir = os.path.join(folder_path, folder)
        if os.path.isdir(folder_dir):
            images = get_file_paths(folder_dir, ".png") + get_file_paths(folder_dir, ".jpg")

            txt_files = get_file_paths(folder_dir, ".txt")


            for root, dirs, files in os.walk(folder_dir):
                for file in files:
                    if os.path.splitext(file)[0].lower() == "header":
                        header_img = os.path.join(folder_dir, file)

            js_object[folder] = [
                {"images": images},
                {"text": txt_files[0] if txt_files else print("no headerimg found")},
                {"headerImg": header_img if os.path.exists(header_img) else print("no headerimg found")}

            ]
            # Generate HTML file
            if txt_files:
                text_file = txt_files[0]
                html_content = read_file_content(text_file)
                html_title = folder
                html_filename = os.path.join(pages_path, folder + ".html")
                generate_html_file(html_filename, html_title, html_content, images, tags)

                intro_content = extract_intro_content(text_file)
                if intro_content:
                    intro_filename = os.path.join(pages_path, folder + "-intro.html")
                    filename = os.path.join(pages_path, folder + ".html")
                    generate_intro_html_file(intro_filename, filename, intro_content, tags)

    return js_object

# Function to extract the content between <intro></intro> tags
def extract_intro_content(file_path):
    with open(file_path, "r") as file:
        file_content = file.read()

    start_tag = "<intro>"
    end_tag = "</intro>"
    start_index = file_content.find(start_tag)
    end_index = file_content.find(end_tag)

    if start_index != -1 and end_index != -1:
        return file_content[start_index + len(start_tag):end_index].strip()

    return None

# Function to read the content of a file
def read_file_content(file_path):
    with open(file_path, "r") as file:
        content = file.read()
    return content


tags = {
    "<italic>": "italic",
    "</italic>": "/italic",
    "<bold>": "bold",
    "</bold>": "/bold",
    "<underline>": "underline",
    "</underline>": "/underline",
    "<blue>": "blue",
    "</blue>": "/blue",
    "<red>": "red",
    "</red>": "/red",
    "<white>": "white",
    "</white>": "/white",
    "<black>": "black",
    "</black>": "/black",
    "<background-blue>": "background-blue",
    "</background-blue>": "/background-blue",
    "<background-red>": "background-red",
    "</background-red>": "/background-red",
    "<background-white>": "background-white",
    "</background-white>": "/background-white",
    "<background-black>": "background-black",
    "</background-black>": "/background-black",
    "<big>": "big",
    "</big>": "/big",
    "<bigger>": "bigger",
    "</bigger>": "/bigger",
    "<biggest>": "biggest",
    "</biggest>": "/biggest",
    "<small>": "small",
    "</small>": "/small",
    "<smaller>": "smaller",
    "</smaller>": "/smaller",
    "<smallest>": "smallest",
    "</smallest>": "/smallest"
}

def generate_intro_html_file(filenameIntro, filename, content, tag_mapping):
    # Replace pseudo tags with corresponding CSS classes


    for tag, css_class in tag_mapping.items():
        content = content.replace(tag, f"<span class='{css_class}'>").replace(f"</{css_class}>", "</span>")

    html_template = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" href="../style.css">
</head>
<body class='intro'>
    {content}
    <a href="#" onclick="changeParentURL('./drawing.html')">full article</a>
    <script>
        function changeParentURL(url) {{
        window.parent.changeParentURL(url);
        }}
    </script>

</body>
</html>'''
    print(filename)
    with open(filenameIntro, "w") as file:
        file.write(html_template)
        print("written: "+ filenameIntro)



def generate_html_file(filename, title, content, image_paths, tag_mapping):
    # Replace pseudo tags with corresponding CSS classes
   
    for tag, css_class in tag_mapping.items():
        content = content.replace(tag, f"<span class='{css_class}'>").replace(f"</{css_class}>", "</span>")

    image_tags = ""
    for image_path in image_paths:
        image_tags += f'<img src=".{image_path}" alt=""> <br>\n'

    html_template = f'''
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
    <title>{title}</title>
    <link rel="stylesheet" href="../style.css">
</head>

<body class='text'>
    <a href='../index.html'>back</a>
    {content} <br> <div class='images'>{image_tags}</div>
</body>
</html>'''

  

    with open(filename, "w") as file:
        file.write(html_template)


# Generate JavaScript objects and HTML files for each folder
about =  json.dumps(generate_js_object_and_html(os.path.join(content_path, "about")), indent=4)
articles = json.dumps(generate_js_object_and_html(os.path.join(content_path, "articles")), indent=4)
projects = json.dumps(generate_js_object_and_html(os.path.join(content_path, "projects")), indent=4)
workshops = json.dumps(generate_js_object_and_html(os.path.join(content_path, "workshops")), indent=4)

# Convert the JavaScript object to JSON
about_json = json.dumps(about, indent=4)
articles_json = json.dumps(articles, indent=4)

# Save the JavaScript object as a JS file
with open("data.js", "w") as file:
    file.write(f"var about = {about} \nvar articles = {articles} \nvar projects = {projects} \nvar workshops = {workshops} \n")



