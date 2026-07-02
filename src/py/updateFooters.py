import re
from pathlib import Path
from datetime import datetime
import tkinter as tk
from tkinter import messagebox


PAGES = [
    "./season2/FormulaSeries/elokvali",
    "./season2/FormulaSeries/eredmenyek",
    "./season2/FormulaSeries/szabalyzat",
    "./season2/SimMasters/elokvali",
    "./season2/SimMasters/eredmenyek",
    "./season2/SimMasters/szabalyzat",
    "./season2/SimMasters/BOP",
    "./season2/SimMasters/idojaras",
]


def update_last_modified(folder):
    html_file = Path(folder) / "index.html"
    if not html_file.exists():
        return f"Nincs ilyen fájl: {html_file}"

    current_timestamp = datetime.now().strftime("%Y. %m. %d. | %H:%M")
    content = html_file.read_text(encoding="utf-8")

    new_content = re.sub(
        r"Utolsó módosítás:\s*\d{4}\.\s*\d{2}\.\s*\d{2}\.\s*\|\s*\d{2}:\d{2}",
        f"Utolsó módosítás: {current_timestamp}",
        content
    )
    if new_content != content:
        html_file.write_text(new_content, encoding="utf-8")
        return f"Frissítve: {folder}"
    else:
        return f"Nincs módosítandó dátum: {folder}"


def update_selected():
    results = []
    for path, var in checkbox_vars.items():
        if var.get():
            results.append(update_last_modified(path))
    if not results:
        messagebox.showwarning(
            "Figyelmeztetés",
            "Legalább egy oldalt válassz ki!"
        )
        return
    messagebox.showinfo(
        "Footerek frissítve",
        "\n".join(results)
    )


def select_all():
    for var in checkbox_vars.values():
        var.set(True)


root = tk.Tk()
root.title("Footer Updater")
root.geometry("600x300")

tk.Label(
    root,
    text="Válaszd ki melyik oldalak frissültek:",
    font=("Arial", 12, "bold")
).pack(pady=10)

container = tk.Frame(root)
container.pack(fill="both", expand=True, padx=10)

formula_frame = tk.LabelFrame(container, text="FormulaSeries", padx=10, pady=10)
formula_frame.pack(side="left", fill="both", expand=True, padx=5)

sim_frame = tk.LabelFrame(container, text="SimMasters", padx=10, pady=10)
sim_frame.pack(side="left", fill="both", expand=True, padx=5)

checkbox_vars = {}

for page in PAGES:
    var = tk.BooleanVar()
    checkbox_vars[page] = var

    display_name = page.replace("./season2/", "")

    parent = formula_frame if "/FormulaSeries/" in page else sim_frame
    tk.Checkbutton(
        parent,
        text=display_name,
        font=("Arial", 12),
        variable=var,
        anchor="w"
    ).pack(fill="x", anchor="w")


button_frame = tk.Frame(root)
button_frame.pack(pady=15)
tk.Button(
    button_frame,
    text="Select All",
    command=select_all,
    font=("Arial", 14, "bold")
).pack(side="left", padx=5)
tk.Button(
    button_frame,
    text="Frissítés",
    command=update_selected,
    font=("Arial", 14, "bold")
).pack(side="left", padx=5)

root.mainloop()
