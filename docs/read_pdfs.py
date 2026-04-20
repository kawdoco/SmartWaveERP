import os
from PyPDF2 import PdfReader

docs_dir = r"c:\Dev\SmartWaveERP\docs"
output_file = os.path.join(docs_dir, "extracted_docs.txt")

with open(output_file, "w", encoding="utf-8") as f:
    for filename in os.listdir(docs_dir):
        if filename.endswith(".pdf"):
            filepath = os.path.join(docs_dir, filename)
            f.write(f"--- Extracting {filename} ---\n")
            try:
                reader = PdfReader(filepath)
                text = ""
                for page in reader.pages:
                    extracted = page.extract_text()
                    if extracted:
                        text += extracted + "\n"
                f.write(text.strip() + "\n")
                f.write(f"--- End of {filename} ---\n\n")
            except Exception as e:
                f.write(f"Failed to read {filename}: {e}\n\n")
