from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
import json

def create_document(description, diagram, threats, output_file: str = "report.pdf") -> str:

    c = canvas.Canvas(output_file, pagesize=A4)
    width, height = A4
    y = height - 50
    line_height = 14

    def write_lines(text_lines):
        nonlocal y
        for line in text_lines:
            if y < 50:
                c.showPage()
                y = height - 50
            c.drawString(50, y, line)
            y -= line_height

    write_lines(["SYSTEM DESCRIPTION", "------------------"])
    write_lines(description.splitlines())
    y -= 10

    write_lines(["PLANTUML DIAGRAM", "------------------"])
    write_lines(diagram.splitlines())
    y -= 10

    write_lines(["THREAT MODELING", "------------------"])
    threats_text = json.dumps(threats, indent=2)
    write_lines(threats_text.splitlines())

    c.save()
    print(f"PDF saved to {output_file}")
    return output_file
