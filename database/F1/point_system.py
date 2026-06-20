PONTOZOTTAK = 10

ARÁNYOK = [
    1.00, # 1
    0.85, # 2
    0.73, # 3
    0.63, # 4
    0.55, # 5
    0.48, # 6
    0.41, # 7
    0.35, # 8
    0.30, # 9
    0.26, # 10
    0.12, # 11
    0.10, # 12
    0.08, # 13
    0.06, # 14
    0.04, # 15
    0.02  # 16
    ]

ARÁNYOK = [
    1.00, # 1
    0.80, # 2
    0.65, # 3
    0.53, # 4
    0.43, # 5
    0.35, # 6
    0.29, # 7
    0.24, # 8
    0.20, # 9
    0.17, # 10
    ]


if __name__ == '__main__':

    összes_pontrendszer = []
    for első_pontja in range(1, 101):
        pontok = [round(első_pontja * a, 2) for a in ARÁNYOK][:PONTOZOTTAK]
        
        veszteseg_lista = [abs(round(p) - p) for p in pontok]   # if not (0.45 <= abs(round(p) - p) <= 0.55)
        if veszteseg_lista: kerekítés_veszteség = sum(veszteseg_lista) / len(veszteseg_lista)
        else: float('inf')
        összes_pontrendszer.append((első_pontja, pontok, kerekítés_veszteség))


    METTŐL = 15
    MEDDIG = 50
    PONTRENDSZEREK = [rendszer for rendszer in összes_pontrendszer if METTŐL <= rendszer[0] <= MEDDIG]

    LEGJOBB_X = MEDDIG - METTŐL     # Hány elem legyen a legjobb listában
    LEGJOBB_X = 10
    LEGJOBBAK = sorted(PONTRENDSZEREK, key=lambda x: x[2])[:]    

    KIÍR = 0   # 0 - növekvő    |    1 - összes
    if KIÍR:
        for első_pontja, rendszer, kerekítés_veszteség in PONTRENDSZEREK:
            lista_str = "\t".join(f"{pont:.2f}" for pont in rendszer)
            print(f"{int(első_pontja)}  -  {lista_str}\t\t{kerekítés_veszteség:.4f}")
    else:
        print(f"Legjobb {LEGJOBB_X} pontrendszer (legkisebb átlagos kerekítési hiba):")

       
        for i, (első_pontja, rendszer, kerekítés_veszteség) in enumerate(LEGJOBBAK[:LEGJOBB_X], start=1):
            lista_str1 = "\t".join(f"{pont:.2f}" for pont in rendszer)      # 2 TIZEDESJEGY
            lista_str2 = ""
            lista_str2 = "\t".join(f"{pont:.0f}" for pont in rendszer)     # EGÉSZKÉNT
            print(f"{i}.:\t{lista_str1}\t\t{kerekítés_veszteség:.4f} \n        {lista_str2}")


    HÁNYADIK = 43
    pozicio = next((i for i, (elso, _, _) in enumerate(LEGJOBBAK, start=1) if elso == HÁNYADIK), None)
    if pozicio:
        print(f"\nA(z) {HÁNYADIK} első_pont rendszer a(z) {pozicio}. helyen van az összes rendszerben ({METTŐL}-{MEDDIG})")
    else:
        print(f"\nA(z) {HÁNYADIK} nincs a tartományban")



    RENDSZEROFFICIAL = [25,18,15,12,10,8,6,4,2,1]
    RENDSZERCONSISTENCY = [20,16,13,11,9,7,6,5,4,3]
    print("\n\n")
    eredeti = "\t".join(f"{pont}" for pont in RENDSZEROFFICIAL)
    pontlista = "\t".join(f"{pont/RENDSZEROFFICIAL[0]:.2f}" for pont in RENDSZEROFFICIAL)
    print(f"Official:\n{eredeti}\n{pontlista}")
    print()
    eredeti = "\t".join(f"{pont}" for pont in RENDSZERCONSISTENCY)
    pontlista = "\t".join(f"{pont/RENDSZERCONSISTENCY[0]:.2f}" for pont in RENDSZERCONSISTENCY)
    print(f"Consistency:\n{eredeti}\n{pontlista}")
    
