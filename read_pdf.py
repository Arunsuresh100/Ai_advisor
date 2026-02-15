
import sys

def try_read_pdf(filepath):
    try:
        import pypdf
        with open(filepath, 'rb') as f:
            reader = pypdf.PdfReader(f)
            num_pages = len(reader.pages)
            print(f"DEBUG: Found {num_pages} pages.")
            text = ""
            for i, page in enumerate(reader.pages):
                page_text = page.extract_text()
                print(f"DEBUG: Page {i} text length: {len(page_text) if page_text else 0}")
                text += page_text if page_text else ""
            return text
    except ImportError:
        return "ERROR: pypdf not installed"
    except Exception as e:
        return f"ERROR: {str(e)}"

if __name__ == "__main__":
    filepath = r"d:\git_projects\mca_final_project\abstract.pdf"
    content = try_read_pdf(filepath)
    print("--- CONTENT START ---")
    print(content)
    print("--- CONTENT END ---")
