import json

# Datos parseados del Excel - 3 hojas
# Normalizo nombres de categorías al formato de la app

def parse_recipients(detail_str):
    """Parse RECIPIENTE_DETALLE string to bins array"""
    if not detail_str or not isinstance(detail_str, str):
        return []
    
    # Mapeo de nombres en Excel -> IDs en app
    cat_map = {
        'plástico': 'plastico',
        'plastico': 'plastico',
        'papel_carton': 'papel_carton',
        'papel': 'papel_carton',
        'no_aprovechable': 'no_aprovechable',
        'inorganico': 'inorganico',
        'vidrio': 'vidrio',
        'organico': 'organico',
        'orgánico': 'organico',
        'peligroso': 'peligroso',
        'contaminantes': 'peligroso',  # contaminantes -> peligroso
        'residuos organicos': 'organico',
        'residuos orgánicos': 'organico',
    }
    
    bins = []
    parts = detail_str.split(';')
    for part in parts:
        part = part.strip().lower()
        if ':' in part:
            cat_name, qty_str = part.split(':')
            cat_name = cat_name.strip()
            qty = int(qty_str.strip()) if qty_str.strip().isdigit() else 1
            
            cat_id = cat_map.get(cat_name)
            if cat_id:
                bins.append({"categoryId": cat_id, "quantity": qty, "condition": "fair"})
            else:
                print(f"  WARNING: Categoría no mapeada: '{cat_name}'")
    return bins

def parse_condition(state_str):
    """Normalize conservation state"""
    if not state_str or not isinstance(state_str, str):
        return "regular"
    s = state_str.strip().lower()
    if s in ['bueno', 'bien', 'good']:
        return "bueno"
    elif s in ['regular', 'fair']:
        return "regular"
    elif s in ['malo', 'mal', 'poor']:
        return "malo"
    return "regular"

def parse_accessibility(acc_str):
    """Normalize accessibility"""
    if not acc_str or not isinstance(acc_str, str):
        return "nivel"
    s = acc_str.strip().lower()
    if s in ['rampa', 'ramp']:
        return "rampa"
    elif s in ['nivel', 'level', 'ground']:
        return "nivel"
    elif s in ['escaleras', 'escalones', 'stairs', 'steps']:
        return "escalones"
    elif 'obstaculo' in s or 'obstáculo' in s:
        return "escalones"
    return "nivel"

# ============================================================
# HOJA IZQUIERDA - 14 puntos
# ============================================================
izquierda = [
    {
        "code": "P9031", "name": "Pabellón de Laboratorios de Investigación",
        "ref": "Entrada al Pabellón de Laboratorios de Investigación",
        "lat": -12.0345115, "lng": -75.2392922,
        "state": "Bien", "access": "Rampa",
        "bins_str": "plástico:1;papel_carton:1;no_aprovechable:1;vidrio:1;organico:1",
        "obs": "Techado"
    },
    {
        "code": "P9032", "name": "Comedor Universitario Antiguo",
        "ref": "Puerta principal del Comedor Universitario Antiguo",
        "lat": -12.0340292, "lng": -75.2384805,
        "state": "Bien", "access": "Nivel",
        "bins_str": "plástico:1;papel_carton:1;no_aprovechable:1;vidrio:1;organico:1",
        "obs": "Techado"
    },
    {
        "code": "P9033", "name": "Pabellón G - Monumento FMH",
        "ref": "Al costado del monumento de la FMH",
        "lat": -12.0327490, "lng": -75.2358418,
        "state": "Regular", "access": "Nivel",
        "bins_str": "organico:1;inorganico:1",
        "obs": "Sin techo, despintado"
    },
    {
        "code": "P9034", "name": "Pabellón G - Laboratorio Central FMH",
        "ref": "Frente al Laboratorio Central de la FMH",
        "lat": -12.0327090, "lng": -75.2357060,
        "state": "Bien", "access": "Nivel",
        "bins_str": "organico:1;inorganico:1",
        "obs": "Sin techo, pintados de blanco"
    },
    {
        "code": "P9035", "name": "Pabellón G - Escaleras y Gestión Calidad",
        "ref": "Frente a la escaleras y la Gestión de Calidad",
        "lat": -12.0327162, "lng": -75.2356742,
        "state": "Regular", "access": "Nivel",
        "bins_str": "organico:1;inorganico:1",
        "obs": "Sin techo, despintado"
    },
    {
        "code": "P9036", "name": "Pabellón A - Espaldas Comunicación",
        "ref": "Espaldas de la Facultad de Ciencias de la Comunicación",
        "lat": -12.0332460, "lng": -75.2364004,
        "state": "Mal", "access": "Nivel",
        "bins_str": "organico:1;inorganico:1;contaminantes:1",
        "obs": "Sin techo, despintado y un tacho roto"
    },
    {
        "code": "P9037", "name": "Pabellón A - Espaldas Trabajo Social",
        "ref": "Espaldas de la Facultad de Trabajo Social",
        "lat": -12.0334714, "lng": -75.2370079,
        "state": "Bien", "access": "Rampa",
        "bins_str": "organico:1;inorganico:1",
        "obs": "Techado, despintado"
    },
    {
        "code": "P9038", "name": "Puerta 1 UNCP - Área Verde",
        "ref": "Area verde de la Puerta 1",
        "lat": -12.0322368, "lng": -75.2339234,
        "state": "Regular", "access": "Nivel",
        "bins_str": "organico:1;inorganico:1",
        "obs": "Sin techo, despintado"
    },
    {
        "code": "P9039", "name": "Puerta 1 UNCP - Entrada",
        "ref": "Entrada de la Puerta 1",
        "lat": -12.0321824, "lng": -75.2334571,
        "state": "Bien", "access": "Obstaculo Pista",
        "bins_str": "plástico:1;papel_carton:1;no_aprovechable:1;vidrio:1;organico:1",
        "obs": "Sin techo, todos de color verde pero con su respectivo nombre"
    },
    {
        "code": "P90310", "name": "Pabellón A - Ingreso Principal Área IV",
        "ref": "Frente al ingreso del pabellón principal del Área IV",
        "lat": -12.0332090, "lng": -75.2368870,
        "state": "Bien", "access": "Nivel",
        "bins_str": "plástico:1;papel_carton:1;no_aprovechable:1;vidrio:1;organico:1",
        "obs": "Techado, todos de color plomo pero con su respectivo nombre"
    },
    {
        "code": "P90311", "name": "Pabellón A - Patio Posterior",
        "ref": "Patio posterior / pasillo central frente al pabellón de aulas",
        "lat": -12.0330800, "lng": -75.2366530,
        "state": "Bien", "access": "Nivel",
        "bins_str": "plástico:1;papel_carton:1;vidrio:1;residuos organicos:1",
        "obs": "Techado, despintado y con stickers"
    },
    {
        "code": "P90312", "name": "Pabellón A - Escalinatas",
        "ref": "Al pie de las escalinatas de los pabellones",
        "lat": -12.0328760, "lng": -75.2366950,
        "state": "Regular", "access": "Nivel",
        "bins_str": "organico:1;inorganico:1",
        "obs": "Techado, despintado y con stickers"
    },
    {
        "code": "P90313", "name": "Pabellón A - Áreas Verdes y Pasillo",
        "ref": "Zona de áreas verdes y pasillo principal",
        "lat": -12.0330190, "lng": -75.2369180,
        "state": "Regular", "access": "Nivel",
        "bins_str": "organico:1;inorganico:1;contaminantes:1",
        "obs": "Techado, todos de color plomo pero con su respectivo nombre"
    },
    {
        "code": "P90314", "name": "Pabellón A - Acceso Escuela Sociología",
        "ref": "Frente al acceso principal de la Escuela de Sociología",
        "lat": -12.0324860, "lng": -75.2369590,
        "state": "Regular", "access": "Nivel",
        "bins_str": "plástico:1;papel_carton:1;vidrio:1;residuos organicos:1",
        "obs": "Sin techo, despintado"
    },
]

# ============================================================
# HOJA MEDIO - 18 puntos (incluye 2 duplicados P021, P022 al final)
# ============================================================
medio = [
    {
        "code": "P021", "name": "Losas Deportivas - Frente Estadio",
        "ref": "Frente al estadio",
        "lat": -12.0335294, "lng": -75.2395641,
        "state": "Bueno", "access": "Nivel",
        "bins_str": "plástico:1;papel_carton:1;no_aprovechable:1;vidrio:1;organico:1",
        "obs": "Techado 5 módulos"
    },
    {
        "code": "P022", "name": "Losas Deportivas - Frente Lozas",
        "ref": "Frente a las lozas",
        "lat": -12.0333717, "lng": -75.2391721,
        "state": "Regular", "access": "",
        "bins_str": "organico:1;inorganico:1",
        "obs": "2 módulos"
    },
    {
        "code": "P023", "name": "Patio FIQ",
        "ref": "Patio FIQ",
        "lat": -12.0331950, "lng": -75.2386414,
        "state": "Regular", "access": "Escaleras",
        "bins_str": "organico:1;inorganico:1",
        "obs": "3 módulos"
    },
    {
        "code": "P024", "name": "Facultad de Ingeniería Química - Zona Descanso",
        "ref": "Zona de descanso FIQ",
        "lat": -12.0330041, "lng": -75.2385837,
        "state": "Regular", "access": "Escaleras",
        "bins_str": "papel_carton:1;organico:1;plastico:1",
        "obs": "Techado 3 módulos"
    },
    {
        "code": "P025", "name": "Facultad de Ingeniería Química - Zona Descanso 2",
        "ref": "Zona de descanso FIQ",
        "lat": -12.0328972, "lng": -75.2384121,
        "state": "Regular", "access": "Escaleras",
        "bins_str": "organico:1;inorganico:1;peligroso:1",
        "obs": "3 módulos"
    },
    {
        "code": "P026", "name": "Entrada Facultad de Ingeniería Química",
        "ref": "Entrada FIQ",
        "lat": -12.0328087, "lng": -75.2383071,
        "state": "Regular", "access": "Nivel",
        "bins_str": "papel_carton:1;organico:1;plastico:1",
        "obs": "Techado 3 módulos"
    },
    {
        "code": "P027", "name": "Cafetín FIQ",
        "ref": "Frente cafetín",
        "lat": -12.0328507, "lng": -75.2380265,
        "state": "Regular", "access": "Escaleras",
        "bins_str": "organico:1;inorganico:1",
        "obs": "3 módulos"
    },
    {
        "code": "P028", "name": "Facultad de Educación - Patio 1",
        "ref": "Patio Facultad de Educación",
        "lat": -12.0326972, "lng": -75.2376983,
        "state": "Bueno", "access": "Nivel",
        "bins_str": "organico:1;inorganico:1",
        "obs": "2 módulos"
    },
    {
        "code": "P029", "name": "Facultad de Educación - Patio 2",
        "ref": "Patio Facultad de Educación",
        "lat": -12.0325559, "lng": -75.2377368,
        "state": "Bueno", "access": "Nivel",
        "bins_str": "organico:1;inorganico:1",
        "obs": "2 módulos"
    },
    {
        "code": "P0210", "name": "Facultad de Educación - Patio 3",
        "ref": "Patio Facultad de Educación",
        "lat": -12.0325660, "lng": -75.2375477,
        "state": "Bueno", "access": "Nivel",
        "bins_str": "organico:1;inorganico:1;peligroso:1",
        "obs": "3 módulos"
    },
    {
        "code": "P0211", "name": "Biblioteca Facultad de Educación",
        "ref": "Frente al Paraninfo 3",
        "lat": -12.0326447, "lng": -75.2373938,
        "state": "Regular", "access": "Nivel",
        "bins_str": "organico:1;inorganico:1",
        "obs": "2 módulos"
    },
    {
        "code": "P0212", "name": "Entrada Facultad de Ciencias de la Comunicación",
        "ref": "A un lado del Paraninfo 2",
        "lat": -12.0324267, "lng": -75.2366857,
        "state": "Regular", "access": "",
        "bins_str": "organico:1;inorganico:1",
        "obs": "2 módulos"
    },
    {
        "code": "P0213", "name": "Parque de la Integración - Medicina Humana",
        "ref": "Entrada a la Facultad de Medicina Humana",
        "lat": -12.0321230, "lng": -75.2361513,
        "state": "Regular", "access": "Nivel",
        "bins_str": "organico:1;inorganico:1",
        "obs": "2 módulos"
    },
    {
        "code": "P0214", "name": "Parque de la Integración - Cafetín IIA",
        "ref": "Cafetín de la Facultad de Ingeniería de Industrias Alimentarias",
        "lat": -12.0317531, "lng": -75.2362422,
        "state": "Regular", "access": "Nivel",
        "bins_str": "organico:1;inorganico:1",
        "obs": "2 módulos"
    },
    {
        "code": "P0215", "name": "Facultad de Ingeniería de Minas",
        "ref": "Patio Ingeniería de Minas",
        "lat": -12.0316561, "lng": -75.2361067,
        "state": "Regular", "access": "Nivel",
        "bins_str": "organico:1;inorganico:1",
        "obs": "2 módulos"
    },
    {
        "code": "P0216", "name": "Facultad de Ingeniería Metalurgia y Materiales",
        "ref": "Patio Ingeniería de Metalurgia y de Materiales",
        "lat": -12.0315115, "lng": -75.2355119,
        "state": "Regular", "access": "Nivel",
        "bins_str": "organico:1;inorganico:1",
        "obs": "2 módulos"
    },
    # Duplicados al final de la hoja - los ignoramos (ya están arriba)
]

# ============================================================
# HOJA DERECHA - 17 puntos
# ============================================================
derecha = [
    {
        "code": "P011", "name": "Unidad de Transportes",
        "ref": "Al lado de la unidad de Transportes",
        "lat": -12.0328752, "lng": -75.2396928,
        "state": "Regular", "access": "Nivel",
        "bins_str": "organico:1;inorganico:1",
        "obs": "Sin techo, despintado"
    },
    {
        "code": "P012", "name": "Laboratorio LOPU - FIQ",
        "ref": "Entrada a LOPU",
        "lat": -12.0326700, "lng": -75.2393220,
        "state": "Regular", "access": "Nivel",
        "bins_str": "organico:1;inorganico:1",
        "obs": "Sin techo, despintado"
    },
    {
        "code": "P013", "name": "Laboratorio No Metales FIQ - Espaldas",
        "ref": "Espaldas del Laboratorio No Metales",
        "lat": -12.0326257, "lng": -75.2390169,
        "state": "Bien", "access": "Nivel",
        "bins_str": "plástico:1;papel_carton:1;no_aprovechable:1;vidrio:1;organico:1",
        "obs": "Techado"
    },
    {
        "code": "P014", "name": "Laboratorio No Metales FIQ - Entrada",
        "ref": "Entrada a No Metales",
        "lat": -12.0327500, "lng": -75.2389690,
        "state": "Regular", "access": "Nivel",
        "bins_str": "organico:1;inorganico:1;contaminantes:1",
        "obs": "Sin techo, despintado"
    },
    {
        "code": "P015", "name": "Pabellón C - Patio FIEE",
        "ref": "Patio de la FIEE",
        "lat": -12.0326142, "lng": -75.2383477,
        "state": "Bien", "access": "Nivel",
        "bins_str": "papel_carton:1;organico:1;plastico:1",
        "obs": "Techado, acero"
    },
    {
        "code": "P016", "name": "Pabellón C - Nombre FIQ",
        "ref": "Nombre Facultad de Ingeniería Química",
        "lat": -12.0326316, "lng": -75.2382816,
        "state": "Regular", "access": "Nivel",
        "bins_str": "organico:1;inorganico:1;contaminantes:1",
        "obs": "Sin techo, despintado"
    },
    {
        "code": "P017", "name": "Pabellón C - Entrada",
        "ref": "Entrada al Pabellón C",
        "lat": -12.0328752, "lng": -75.2383393,
        "state": "Regular", "access": "Nivel",
        "bins_str": "organico:1;inorganico:1",
        "obs": "Sin techo, despintado"
    },
    {
        "code": "P018", "name": "Facultad de Educación - Entrada",
        "ref": "Entrada a la Facultad de Educación",
        "lat": -12.0322512, "lng": -75.2379172,
        "state": "Bien", "access": "Nivel",
        "bins_str": "plástico:1;papel_carton:1;no_aprovechable:1;vidrio:1;organico:1",
        "obs": "Techado"
    },
    {
        "code": "P019", "name": "Facultad de Educación - Sala Euclides",
        "ref": "Frente a la Sala de Euclides",
        "lat": -12.0325175, "lng": -75.2777070,  # Este lng parece outlier (-75.277 vs -75.237)
        "state": "Bien", "access": "Nivel",
        "bins_str": "organico:1;inorganico:1",
        "obs": "Sin techo, pintado"
    },
    {
        "code": "P0110", "name": "Centro Médico",
        "ref": "Entrada al Centro Médico",
        "lat": -12.0320227, "lng": -75.2375092,
        "state": "Regular", "access": "Nivel",
        "bins_str": "organico:1;inorganico:1",
        "obs": "Sin techo, despintado"
    },
    {
        "code": "P0111", "name": "Parque de la Integración - Dirección Biblioteca",
        "ref": "Diercción a la Biblioteca",
        "lat": -12.0319519, "lng": -75.2362824,
        "state": "Bien", "access": "Nivel",
        "bins_str": "plástico:1;papel_carton:1;no_aprovechable:1;vidrio:1;organico:1",
        "obs": "Techado"
    },
    {
        "code": "P0112", "name": "Parque de la Integración - Cafetín IIA",
        "ref": "Ingreso al Cafetín de Industrias Alimentarias",
        "lat": -12.0324267, "lng": -75.2366857,
        "state": "Regular", "access": "Nivel",
        "bins_str": "organico:1;inorganico:1",
        "obs": "Sin techo, despintado"
    },
    {
        "code": "P0113", "name": "Facultad de Ingeniería de Minas - Entrada",
        "ref": "Entrada a la Facultad de Ingeniería de Minas",
        "lat": -12.0314334, "lng": -75.2359156,
        "state": "Bien", "access": "Nivel",
        "bins_str": "organico:1;inorganico:1",
        "obs": "Techado"
    },
    {
        "code": "P0114", "name": "Facultad de Metalurgia - Auditorio",
        "ref": "Frente al Auditorio de la FIM",
        "lat": -12.0317540, "lng": -75.2359930,
        "state": "Regular", "access": "Nivel",
        "bins_str": "plástico:1;papel_carton:1;no_aprovechable:1;vidrio:1;organico:1",
        "obs": "Sin techo, despintado"
    },
    {
        "code": "P0115", "name": "Facultad de Metalurgia - Patio",
        "ref": "Patio Ingeniería de Minas",
        "lat": -12.0315600, "lng": -75.2357800,
        "state": "Regular", "access": "Nivel",
        "bins_str": "organico:1;inorganico:1",
        "obs": "Sin techo, despintado"
    },
    {
        "code": "P0116", "name": "Facultad de Metalurgia y Minerales - Entrada",
        "ref": "Entrada a la Facultad de Ingeniería de Metalurgia y Minerales",
        "lat": -12.0312786, "lng": -75.2355404,
        "state": "Regular", "access": "Nivel",
        "bins_str": "organico:1;inorganico:1",
        "obs": "Sin techo, despintado"
    },
    {
        "code": "P0117", "name": "Explanada UNCP - Techo Azul",
        "ref": "Entrada por el Techo Azul",
        "lat": -12.0309832, "lng": -75.2349809,
        "state": "Regular", "access": "Nivel",
        "bins_str": "organico:1;inorganico:1",
        "obs": "Sin techo, despintado"
    },
]

# ============================================================
# EXCEL DUPLICADOS (líneas 22-30) - Explanada UNCP - ya cubiertos en DERECHA
# ============================================================

# COMBINAR TODOS
all_points = izquierda + medio + derecha

# Renumerar secuencialmente P01, P02, ...
points_json = []
for i, p in enumerate(all_points, 1):
    new_code = f"P{i:02d}"
    
    bins = parse_recipients(p["bins_str"])
    
    # Corregir longitud outlier en P019 (-75.277 -> -75.237)
    lng = p["lng"]
    if lng < -75.25:  # outlier detectado
        lng = -75.2377  # aproximación corregida
    
    point = {
        "id": new_code,
        "code": new_code,
        "name": p["name"],
        "referenceBuilding": p["ref"],
        "lat": p["lat"],
        "lng": lng,
        "photoUrl": "",
        "conservationState": parse_condition(p["state"]),
        "accessibility": parse_accessibility(p["access"]),
        "observations": p["obs"],
        "bins": bins,
        "active": True
    }
    points_json.append(point)
    print(f"{new_code}: {p['name']} - {len(bins)} bins - lat={p['lat']:.6f}, lng={lng:.6f}")

print(f"\nTotal puntos: {len(points_json)}")

# Guardar JSON
with open('C:\\Users\\Intel\\Desktop\\APLICACIÓN_ECOUNCP\\src\\data\\points.json', 'w', encoding='utf-8') as f:
    json.dump(points_json, f, ensure_ascii=False, indent=2)

print("\n✅ points.json actualizado")