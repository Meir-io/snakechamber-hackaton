if num_contratos > 10:
    nombre = mapa_empresas.get(nodo, "Desconocida")
    
    if num_contratos >= 20:
        nivel_riesgo = "roja"
    elif num_contratos >= 15:
        nivel_riesgo = "naranja"
    else:
        nivel_riesgo = "amarilla"
        
    alertas.append({
        "rfc": nodo,
        "nombre": nombre,
        "tipo": "Empresa",
        "riesgo": nivel_riesgo,
        "motivo": f"Acaparamiento extremo: {num_contratos} contratos adjudicados",
        "conexiones": num_contratos
    })