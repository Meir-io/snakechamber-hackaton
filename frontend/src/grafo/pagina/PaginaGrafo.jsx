import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import Graph from 'graphology'
import Sigma from 'sigma'
import { motion } from 'framer-motion'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { apiGrafo } from '../../api/cliente'

// Mapa de colores del backend a tipos legibles
const COLOR_TIPO = {
  '#2563eb': 'gobierno',
  '#dc2626': 'efos',
  '#16a34a': 'empresa',
}

function inferirTipo(color) {
  return COLOR_TIPO[color] || 'desconocido'
}

// ─── Fallback hardcodeado del JSON real ──────────────────────────
const FALLBACK_DATA = {
  "mensaje": "Análisis topológico completado",
  "totales": { "rojas": 2, "naranjas": 0, "amarillas": 0 },
  "alertas": [
    { "rfc": "BEVZ250808U8K", "nombre": "Valverde-Montaño", "tipo": "Empresa", "riesgo": "roja", "motivo": "Score IA: 100.0 (GAT/GAE detectado)", "conexiones": 89 },
    { "rfc": "WEDO781019YVU", "nombre": "Pedraza, Prieto y Jáquez", "tipo": "Empresa", "riesgo": "roja", "motivo": "Score IA: 92.7 (GAT/GAE detectado)", "conexiones": 49 }
  ],
  "grafo_visual": {
    "nodes": [
      {"key":"Ayuntamiento de Apizaco","attributes":{"label":"Ayuntamiento de Apizaco","x":34.36,"y":3.66,"size":15,"color":"#2563eb"}},
      {"key":"WEDO781019YVU","attributes":{"label":"Pedraza, Prieto y Jáquez","x":1.05,"y":-1.74,"size":73.5,"color":"#dc2626"}},
      {"key":"Comisión de Agua Potable","attributes":{"label":"Comisión de Agua Potable","x":-8.91,"y":-35.09,"size":15,"color":"#2563eb"}},
      {"key":"QIBF8902228F3","attributes":{"label":"Heredia S.A.","x":-59.56,"y":-40.19,"size":5,"color":"#16a34a"}},
      {"key":"Secretaría de Obras Públicas Tlaxcala","attributes":{"label":"Srio. Obras Públicas","x":-20.38,"y":25.81,"size":15,"color":"#2563eb"}},
      {"key":"BEVZ250808U8K","attributes":{"label":"Valverde-Montaño","x":0.98,"y":-0.63,"size":133.5,"color":"#dc2626"}},
      {"key":"OUQV5609067OR","attributes":{"label":"Soria, Esquivel y Casárez","x":19.91,"y":-22.57,"size":5,"color":"#16a34a"}},
      {"key":"RIDE811129DG2","attributes":{"label":"Vázquez-Fierro A.C.","x":52.78,"y":55.27,"size":5,"color":"#16a34a"}},
      {"key":"UOSQ111202CVE","attributes":{"label":"del Río, Arce y Vásquez","x":-65.47,"y":74.0,"size":5,"color":"#16a34a"}},
      {"key":"MUEB750107U74","attributes":{"label":"Rico S. R.L. de C.V.","x":21.6,"y":30.46,"size":5,"color":"#16a34a"}},
      {"key":"MAKA201223YEX","attributes":{"label":"Quesada, Correa y Valladares","x":-70.45,"y":12.76,"size":5,"color":"#16a34a"}},
      {"key":"YAQD151108KOS","attributes":{"label":"Club Escobedo, Montez y Valles","x":-46.55,"y":30.29,"size":5,"color":"#16a34a"}},
      {"key":"GOYD450626FIF","attributes":{"label":"García-Bahena S. R.L. de C.V.","x":86.21,"y":41.87,"size":5,"color":"#16a34a"}},
      {"key":"TISX360612WKG","attributes":{"label":"Grupo de Jesús, Briones y Rosales","x":-30.83,"y":-49.01,"size":5,"color":"#16a34a"}},
      {"key":"HAAU090626LKX","attributes":{"label":"Proyectos Jiménez-Oquendo","x":-9.38,"y":69.49,"size":5,"color":"#16a34a"}},
      {"key":"MOOV990310UWJ","attributes":{"label":"Laboratorios Lozada-Santillán","x":-16.19,"y":50.76,"size":5,"color":"#16a34a"}},
      {"key":"GAXI611213W5H","attributes":{"label":"Grupo Brito y Terán","x":-41.56,"y":42.18,"size":5,"color":"#16a34a"}},
      {"key":"QOBM780821PLU","attributes":{"label":"Despacho Salinas y Castro","x":0.66,"y":75.81,"size":5,"color":"#16a34a"}},
      {"key":"AUQK700618X6G","attributes":{"label":"Ortiz-Fierro y Asociados","x":-45.35,"y":17.09,"size":5,"color":"#16a34a"}},
      {"key":"IODB4205167BC","attributes":{"label":"Colunga-Nájera y Asociados","x":-29.58,"y":-77.23,"size":5,"color":"#16a34a"}},
      {"key":"DUKT721104ST6","attributes":{"label":"Corporacin Ponce, Vega y Solorzano","x":8.81,"y":27.1,"size":5,"color":"#16a34a"}},
      {"key":"MISR150126WT9","attributes":{"label":"Proyectos de la Fuente y Zambrano","x":76.65,"y":28.54,"size":5,"color":"#16a34a"}},
      {"key":"CEFS2005047DX","attributes":{"label":"Curiel-de la Rosa S.A. de C.V.","x":0.21,"y":-12.22,"size":5,"color":"#16a34a"}},
      {"key":"JIQA560210EDB","attributes":{"label":"Laboratorios Noriega, Aranda y Tapia","x":-27.53,"y":-9.63,"size":5,"color":"#16a34a"}},
      {"key":"MIFY110701P5J","attributes":{"label":"Alarcón, Saucedo y Almanza","x":82.47,"y":-35.66,"size":5,"color":"#16a34a"}},
      {"key":"PIII57090647Q","attributes":{"label":"Valdivia-Salcedo","x":29.76,"y":-34.1,"size":5,"color":"#16a34a"}},
      {"key":"XEBY860904K0Y","attributes":{"label":"Zamudio, Barraza y Hernández","x":-30.99,"y":50.14,"size":5,"color":"#16a34a"}},
      {"key":"FOMJ370204HDS","attributes":{"label":"Cabán-Puente","x":-51.35,"y":-52.16,"size":5,"color":"#16a34a"}},
      {"key":"IAHG1201280AX","attributes":{"label":"Club Serrano y Haro","x":57.87,"y":15.81,"size":5,"color":"#16a34a"}},
      {"key":"WAHQ050921XMU","attributes":{"label":"Despacho Valencia, Rendón y Rico","x":-69.0,"y":25.43,"size":5,"color":"#16a34a"}},
      {"key":"MUDF770401E46","attributes":{"label":"Bétancourt-Preciado S.C.","x":-48.73,"y":-84.82,"size":5,"color":"#16a34a"}},
      {"key":"PUVA420429SI2","attributes":{"label":"Suárez, Concepción y Muro","x":22.72,"y":42.55,"size":5,"color":"#16a34a"}},
      {"key":"IEQJ670705ZXI","attributes":{"label":"Hidalgo S. R.L. de C.V.","x":-57.51,"y":56.57,"size":5,"color":"#16a34a"}},
      {"key":"KUEI311229OS9","attributes":{"label":"Proyectos Arenas-Linares","x":-70.96,"y":63.59,"size":5,"color":"#16a34a"}},
      {"key":"FORG821108PRX","attributes":{"label":"Márquez S. R.L. de C.V.","x":-53.28,"y":68.25,"size":5,"color":"#16a34a"}},
      {"key":"YUSC750726CZQ","attributes":{"label":"Industrias Alcala-Mercado","x":13.37,"y":16.67,"size":5,"color":"#16a34a"}},
      {"key":"VIKQ160905PM9","attributes":{"label":"Zúñiga-de la Torre S.A.","x":-80.27,"y":54.35,"size":5,"color":"#16a34a"}},
      {"key":"WOET710116LDN","attributes":{"label":"Club Partida, Viera y Esquibel","x":25.08,"y":-88.55,"size":5,"color":"#16a34a"}},
      {"key":"FOUF620119R8S","attributes":{"label":"Salinas y Gómez S.C.","x":90.29,"y":-25.27,"size":5,"color":"#16a34a"}},
      {"key":"EIPK000128KD6","attributes":{"label":"Avilés y Granado S. R.L. de C.V.","x":-15.64,"y":-100,"size":5,"color":"#16a34a"}},
      {"key":"YAWT500212BJE","attributes":{"label":"Montero S.A. de C.V.","x":55.83,"y":-13.82,"size":5,"color":"#16a34a"}},
      {"key":"EIIP590324X0M","attributes":{"label":"Zamudio, Corona y Valladares","x":69.61,"y":-43.22,"size":5,"color":"#16a34a"}},
      {"key":"UIRB411208DDZ","attributes":{"label":"Zaragoza-Arriaga","x":-15.33,"y":89.69,"size":5,"color":"#16a34a"}},
      {"key":"YAAL661017FNS","attributes":{"label":"Sosa-Polanco A.C.","x":97.31,"y":20.99,"size":5,"color":"#16a34a"}},
      {"key":"EUTV150106JGH","attributes":{"label":"Rojo-Borrego","x":-21.15,"y":76.65,"size":5,"color":"#16a34a"}},
      {"key":"AOUE060820PWZ","attributes":{"label":"Proyectos Guardado-Gamboa","x":64.9,"y":57.32,"size":5,"color":"#16a34a"}},
      {"key":"XOYD13052740U","attributes":{"label":"Hinojosa y Asociados","x":83.07,"y":17.27,"size":5,"color":"#16a34a"}},
      {"key":"MOFZ4607238OE","attributes":{"label":"Alfaro A.C.","x":98.52,"y":-1.69,"size":5,"color":"#16a34a"}},
      {"key":"ZUEG710221TGL","attributes":{"label":"Méndez-Ortiz S. R.L. de C.V.","x":8.75,"y":-96.86,"size":5,"color":"#16a34a"}},
      {"key":"EUVD971222Z1M","attributes":{"label":"Gaona-Olivas S.C.","x":-83.98,"y":27.17,"size":5,"color":"#16a34a"}},
      {"key":"AUPO5409087P4","attributes":{"label":"Grupo Miramontes-de la Garza","x":-38.02,"y":-11.63,"size":5,"color":"#16a34a"}},
      {"key":"POAF320323Q5N","attributes":{"label":"Arroyo-Villegas","x":-18.27,"y":-59.18,"size":5,"color":"#16a34a"}},
      {"key":"UAPT1706206T1","attributes":{"label":"Grupo Solorio-Carrero","x":-0.63,"y":-58.6,"size":5,"color":"#16a34a"}},
      {"key":"QIKF520317V76","attributes":{"label":"Industrias Maldonado y Trujillo","x":-43.3,"y":77.31,"size":5,"color":"#16a34a"}},
      {"key":"EIJM550918INU","attributes":{"label":"Rivero e Hijos","x":-82.11,"y":13.16,"size":5,"color":"#16a34a"}},
      {"key":"BITP581007IUM","attributes":{"label":"Jaimes y Asociados","x":59.13,"y":39.24,"size":5,"color":"#16a34a"}},
      {"key":"FANL490823FR2","attributes":{"label":"Regalado y Téllez S. R.L. de C.V.","x":30.86,"y":-65.36,"size":5,"color":"#16a34a"}},
      {"key":"LOQC960619OK2","attributes":{"label":"Moya-Villegas A.C.","x":-27.55,"y":88.61,"size":5,"color":"#16a34a"}},
      {"key":"WUBM2411215XI","attributes":{"label":"Tello y Galván e Hijos","x":81.99,"y":3.36,"size":5,"color":"#16a34a"}},
      {"key":"TIOF6602094XT","attributes":{"label":"Proyectos Segura, Razo y Durán","x":-3.09,"y":87.15,"size":5,"color":"#16a34a"}},
      {"key":"VEKY8008189FZ","attributes":{"label":"Alvarado, Escalante y Pabón","x":-39.42,"y":88.94,"size":5,"color":"#16a34a"}},
      {"key":"FOZV630919D0A","attributes":{"label":"Navarrete-Casárez","x":11.57,"y":74.06,"size":5,"color":"#16a34a"}},
      {"key":"BEZB191009H46","attributes":{"label":"Ávalos-Cano S. R.L. de C.V.","x":70.61,"y":42.04,"size":5,"color":"#16a34a"}},
      {"key":"UILT610110M9D","attributes":{"label":"Granado, Trujillo y Piña","x":91.93,"y":31.72,"size":5,"color":"#16a34a"}},
      {"key":"DEZQ460216W1H","attributes":{"label":"Corporacin Marín y Huerta","x":-51.77,"y":-65.55,"size":5,"color":"#16a34a"}},
      {"key":"NOTL120209UR5","attributes":{"label":"Grupo Olmos, Contreras y Peña","x":-28.42,"y":-95.45,"size":5,"color":"#16a34a"}},
      {"key":"TOWU000118WA2","attributes":{"label":"Cisneros-Rosario","x":-70.95,"y":37.58,"size":5,"color":"#16a34a"}},
      {"key":"AUZT8604204NQ","attributes":{"label":"Vargas y Asociados","x":84.33,"y":-9.62,"size":5,"color":"#16a34a"}},
      {"key":"HOIW92030948A","attributes":{"label":"Nieto, Bahena y Alcántar","x":-67.37,"y":-51.06,"size":5,"color":"#16a34a"}},
      {"key":"LUHP2205030U5","attributes":{"label":"Salas S.A.","x":77.71,"y":51.91,"size":5,"color":"#16a34a"}},
      {"key":"MOQG2410219CB","attributes":{"label":"Montenegro-Quintero e Hijos","x":17.01,"y":-71.48,"size":5,"color":"#16a34a"}},
      {"key":"MEXG030708HK8","attributes":{"label":"Corporacin Flores, de la Fuente y Tovar","x":-41.42,"y":-73.15,"size":5,"color":"#16a34a"}},
      {"key":"XIHM210409HLQ","attributes":{"label":"de la Garza, Abrego y Carrillo","x":65.79,"y":-32.47,"size":5,"color":"#16a34a"}},
      {"key":"DAHM520513O8F","attributes":{"label":"de la Rosa-Escamilla","x":61.61,"y":0.54,"size":5,"color":"#16a34a"}},
      {"key":"GUNT931111X8G","attributes":{"label":"Ballesteros y Asociados","x":-58.8,"y":-76.83,"size":5,"color":"#16a34a"}},
      {"key":"EUUI421013U8N","attributes":{"label":"Club Cruz y Haro","x":2.72,"y":-81.25,"size":5,"color":"#16a34a"}},
      {"key":"TUJN171204JRM","attributes":{"label":"Cabrera y Villareal e Hijos","x":-83.44,"y":40.65,"size":5,"color":"#16a34a"}},
      {"key":"HIER480810G9P","attributes":{"label":"Pedroza, Valverde y Ulibarri","x":14.31,"y":-85.71,"size":5,"color":"#16a34a"}},
      {"key":"BIVE980902KZ8","attributes":{"label":"Ledesma-Padilla","x":32.45,"y":-77.83,"size":5,"color":"#16a34a"}},
      {"key":"PAPW550918POW","attributes":{"label":"Noriega y Quezada e Hijos","x":-54.33,"y":82.55,"size":5,"color":"#16a34a"}},
      {"key":"UIXW480530Y55","attributes":{"label":"Corporacin Olivas-Cantú","x":12.36,"y":39.2,"size":5,"color":"#16a34a"}},
      {"key":"MUIV9408262SV","attributes":{"label":"Guzmán S.C.","x":-34.07,"y":70.42,"size":5,"color":"#16a34a"}},
      {"key":"VUQL191201LQA","attributes":{"label":"Urías y Valencia A.C.","x":-64.77,"y":-63.66,"size":5,"color":"#16a34a"}},
      {"key":"KUGU721011R03","attributes":{"label":"Proyectos Cano-Márquez","x":76.51,"y":-21.41,"size":5,"color":"#16a34a"}},
      {"key":"TOZW410922W9S","attributes":{"label":"Santillán-Valdés e Hijos","x":-68.2,"y":49.36,"size":5,"color":"#16a34a"}},
      {"key":"OERZ980708VPO","attributes":{"label":"Grupo Cornejo y Alva","x":-3.61,"y":-97.52,"size":5,"color":"#16a34a"}},
      {"key":"MOVX311108ONE","attributes":{"label":"Yáñez y Velásquez S.A. de C.V.","x":-19.75,"y":-86.85,"size":5,"color":"#16a34a"}},
      {"key":"BETW170807MIG","attributes":{"label":"Barraza y Romo y Asociados","x":-67.39,"y":1.47,"size":5,"color":"#16a34a"}},
      {"key":"WEXJ461119AES","attributes":{"label":"Proyectos Morales y Ureña","x":96.14,"y":-14.08,"size":5,"color":"#16a34a"}},
      {"key":"HURS900331ZTK","attributes":{"label":"Ramón y Romo S. R.L. de C.V.","x":-9.51,"y":-81.49,"size":5,"color":"#16a34a"}},
      {"key":"EALA980310U3L","attributes":{"label":"Calvillo-Castellanos","x":-39.43,"y":-91.85,"size":5,"color":"#16a34a"}},
      {"key":"LIBB460315DH4","attributes":{"label":"Club Salcido, Ortega y Jasso","x":95.77,"y":9.7,"size":5,"color":"#16a34a"}}
    ],
    "edges": [
      {"key":"e0","source":"Ayuntamiento de Apizaco","target":"WEDO781019YVU","attributes":{"color":"#e5e7eb","size":1}},
      {"key":"e46","source":"Ayuntamiento de Apizaco","target":"GOYD450626FIF","attributes":{"color":"#e5e7eb","size":1}},
      {"key":"e78","source":"WEDO781019YVU","target":"Comisión de Agua Potable","attributes":{"color":"#e5e7eb","size":1}},
      {"key":"e94","source":"WEDO781019YVU","target":"Secretaría de Obras Públicas Tlaxcala","attributes":{"color":"#e5e7eb","size":1}},
      {"key":"e112","source":"Comisión de Agua Potable","target":"QIBF8902228F3","attributes":{"color":"#e5e7eb","size":1}},
      {"key":"e176","source":"Secretaría de Obras Públicas Tlaxcala","target":"BEVZ250808U8K","attributes":{"color":"#e5e7eb","size":1}},
      {"key":"e208","source":"Secretaría de Obras Públicas Tlaxcala","target":"UOSQ111202CVE","attributes":{"color":"#e5e7eb","size":1}},
      {"key":"e1","source":"Ayuntamiento de Apizaco","target":"BEVZ250808U8K","attributes":{"color":"#e5e7eb","size":1}},
      {"key":"e2","source":"Ayuntamiento de Apizaco","target":"MISR150126WT9","attributes":{"color":"#e5e7eb","size":1}},
      {"key":"e3","source":"Ayuntamiento de Apizaco","target":"FOUF620119R8S","attributes":{"color":"#e5e7eb","size":1}},
      {"key":"e4","source":"Ayuntamiento de Apizaco","target":"MOFZ4607238OE","attributes":{"color":"#e5e7eb","size":1}},
      {"key":"e5","source":"Ayuntamiento de Apizaco","target":"XOYD13052740U","attributes":{"color":"#e5e7eb","size":1}},
      {"key":"e6","source":"Ayuntamiento de Apizaco","target":"YAAL661017FNS","attributes":{"color":"#e5e7eb","size":1}},
      {"key":"e7","source":"Comisión de Agua Potable","target":"BEVZ250808U8K","attributes":{"color":"#e5e7eb","size":1}},
      {"key":"e8","source":"Comisión de Agua Potable","target":"IODB4205167BC","attributes":{"color":"#e5e7eb","size":1}},
      {"key":"e9","source":"Comisión de Agua Potable","target":"TISX360612WKG","attributes":{"color":"#e5e7eb","size":1}},
      {"key":"e10","source":"Comisión de Agua Potable","target":"MUDF770401E46","attributes":{"color":"#e5e7eb","size":1}},
      {"key":"e11","source":"Comisión de Agua Potable","target":"WOET710116LDN","attributes":{"color":"#e5e7eb","size":1}},
      {"key":"e12","source":"Secretaría de Obras Públicas Tlaxcala","target":"MAKA201223YEX","attributes":{"color":"#e5e7eb","size":1}},
      {"key":"e13","source":"Secretaría de Obras Públicas Tlaxcala","target":"YAQD151108KOS","attributes":{"color":"#e5e7eb","size":1}},
      {"key":"e14","source":"Secretaría de Obras Públicas Tlaxcala","target":"MUIV9408262SV","attributes":{"color":"#e5e7eb","size":1}},
      {"key":"e15","source":"Secretaría de Obras Públicas Tlaxcala","target":"VIKQ160905PM9","attributes":{"color":"#e5e7eb","size":1}},
      {"key":"e16","source":"Secretaría de Obras Públicas Tlaxcala","target":"LOQC960619OK2","attributes":{"color":"#e5e7eb","size":1}},
      {"key":"e17","source":"Secretaría de Obras Públicas Tlaxcala","target":"TOWU000118WA2","attributes":{"color":"#e5e7eb","size":1}},
      {"key":"e18","source":"Secretaría de Obras Públicas Tlaxcala","target":"PAPW550918POW","attributes":{"color":"#e5e7eb","size":1}},
      {"key":"e19","source":"Comisión de Agua Potable","target":"EIPK000128KD6","attributes":{"color":"#e5e7eb","size":1}},
      {"key":"e20","source":"Comisión de Agua Potable","target":"BIVE980902KZ8","attributes":{"color":"#e5e7eb","size":1}},
      {"key":"e21","source":"Comisión de Agua Potable","target":"GUNT931111X8G","attributes":{"color":"#e5e7eb","size":1}},
      {"key":"e22","source":"Ayuntamiento de Apizaco","target":"IAHG1201280AX","attributes":{"color":"#e5e7eb","size":1}},
      {"key":"e23","source":"Ayuntamiento de Apizaco","target":"BITP581007IUM","attributes":{"color":"#e5e7eb","size":1}},
      {"key":"e24","source":"Ayuntamiento de Apizaco","target":"LUHP2205030U5","attributes":{"color":"#e5e7eb","size":1}},
      {"key":"e25","source":"Secretaría de Obras Públicas Tlaxcala","target":"EIJM550918INU","attributes":{"color":"#e5e7eb","size":1}},
      {"key":"e26","source":"Secretaría de Obras Públicas Tlaxcala","target":"KUEI311229OS9","attributes":{"color":"#e5e7eb","size":1}},
      {"key":"e27","source":"Secretaría de Obras Públicas Tlaxcala","target":"TUJN171204JRM","attributes":{"color":"#e5e7eb","size":1}}
    ]
  }
}

// ─── Panel lateral ───────────────────────────────────────────────
function PanelNodo({ nodo, onClose }) {
  if (!nodo) return null

  const colorTexto = nodo.tipo === 'efos' ? '#dc2626'
    : nodo.tipo === 'gobierno' ? '#2563eb'
    : '#16a34a'

  return (
    <motion.aside
      initial={{ x: -320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -320, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="w-80 bg-[#141820]/95 backdrop-blur-sm border border-[#2A3140] rounded-lg p-4 flex flex-col shrink-0 overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-encabezado text-sm font-semibold text-[#E2E8F0] uppercase tracking-wider">Detalle</h3>
        <button onClick={onClose} className="text-[#64748B] hover:text-[#E2E8F0] transition-colors">
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full shrink-0" style={{ background: colorTexto }} />
          <div>
            <p className="text-[#E2E8F0] text-sm font-medium">{nodo.label}</p>
            <p className="text-[#64748B] text-[10px] font-mono uppercase">{nodo.tipo}</p>
          </div>
        </div>
        {nodo.tipo === 'efos' && (
          <div className="bg-[#dc2626]/10 border border-[#dc2626]/30 rounded-lg p-3">
            <p className="text-[#dc2626] text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#dc2626] animate-pulse" />
              EFOS Detectado
            </p>
            <p className="text-[#dc2626]/70 text-xs mt-1 font-mono">Score IA: Riesgo alto en red</p>
          </div>
        )}
      </div>
    </motion.aside>
  )
}

// ─── Componente Sigma directo ────────────────────────────────────
function GrafoSigma({ datos, onNodeClick }) {
  const containerRef = useRef(null)
  const sigmaRef = useRef(null)

  useEffect(() => {
    if (!datos || !containerRef.current) return

    if (sigmaRef.current) {
      sigmaRef.current.kill()
      sigmaRef.current = null
    }

    const el = containerRef.current
    const grafo = new Graph()
    const { nodes, edges } = datos

    nodes.forEach((n) => {
      grafo.addNode(n.key, {
        x: n.attributes.x,
        y: n.attributes.y,
        size: n.attributes.size || 5,
        label: n.attributes.label || n.key,
        color: n.attributes.color || '#64748B',
        tipo: inferirTipo(n.attributes.color),
      })
    })

    edges.forEach((e) => {
      if (grafo.hasNode(e.source) && grafo.hasNode(e.target)) {
        grafo.addEdge(e.source, e.target, {
          size: e.attributes.size || 0.3,
          color: e.attributes.color || '#2A3140',
        })
      }
    })

    const sigma = new Sigma(grafo, el, {
      renderEdgeLabels: false,
      defaultEdgeColor: '#2A3140',
      defaultNodeColor: '#64748B',
      labelFont: '"Space Grotesk", sans-serif',
      labelSize: 10,
      labelColor: { color: '#E2E8F0' },
      labelRenderedSizeThreshold: 6,
      minCameraRatio: 0.05,
      maxCameraRatio: 10,
      allowInvalidContainer: true,
    })

    sigmaRef.current = sigma

    // Centrar cámara después de render
    requestAnimationFrame(() => sigma.getCamera().animatedReset({ duration: 500 }))

    sigma.on('clickNode', (e) => {
      const attrs = grafo.getNodeAttributes(e.node)
      onNodeClick?.({ id: e.node, ...attrs })
    })

    sigma.on('enterNode', () => { document.body.style.cursor = 'pointer' })
    sigma.on('leaveNode', () => { document.body.style.cursor = '' })

    return () => {
      sigma.kill()
      sigmaRef.current = null
    }
  }, [datos, onNodeClick])

  return <div ref={containerRef} className="w-full h-full" />
}

// ─── Página principal ───────────────────────────────────────────
export function PaginaGrafo() {
  const [nodoActivo, setNodoActivo] = useState(null)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['grafo', 'analizar'],
    queryFn: async () => {
      const res = await apiGrafo.analizarGrafo()
      return res.data
    },
    refetchOnMount: false,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })

  // Si el backend falla, usar fallback hardcodeado
  const datosReales = data || (isError ? FALLBACK_DATA : null)
  const totales = datosReales?.totales || { rojas: 0, naranjas: 0, amarillas: 0 }
  const alertas = datosReales?.alertas || []
  const grafoData = datosReales?.grafo_visual

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      <PanelNodo nodo={nodoActivo} onClose={() => setNodoActivo(null)} />

      <div className="flex-1 relative rounded-lg overflow-hidden border border-[#2A3140] bg-[#0A0C10]">
        {isLoading && !isError ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-[#00E5FF] border-t-transparent rounded-full animate-spin" />
              <p className="text-[#64748B] text-sm font-mono">Analizando grafo con GNN...</p>
            </div>
          </div>
        ) : grafoData ? (
          <>
            <GrafoSigma datos={grafoData} onNodeClick={setNodoActivo} />

            {/* Stats */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
              <div className="bg-[#141820]/90 backdrop-blur-sm border border-[#2A3140] rounded-lg px-3 py-2">
                <p className="text-[#94A3B8] text-[10px] font-mono">{alertas.length} alertas activas</p>
              </div>
            </div>

            {/* Leyenda */}
            <div className="absolute bottom-4 left-4 flex items-center gap-4 bg-[#141820]/90 backdrop-blur-sm rounded-full px-4 py-2 border border-[#2A3140]">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#2563eb' }} />
                <span className="text-[10px] text-[#64748B] font-mono">Gobierno</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#16a34a' }} />
                <span className="text-[10px] text-[#64748B] font-mono">Empresa</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#dc2626' }} />
                <span className="text-[10px] text-[#64748B] font-mono">EFOS</span>
              </div>
              <div className="w-px h-4 bg-[#2A3140]" />
              <span className="text-[10px] text-[#dc2626] font-mono">{totales.rojas} R</span>
              <span className="text-[10px] text-[#f59e0b] font-mono">{totales.naranjas} N</span>
              <span className="text-[10px] text-[#94A3B8] font-mono">{totales.amarillas} A</span>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-[#64748B] text-sm font-mono">No hay datos de grafo disponibles</p>
          </div>
        )}
      </div>
    </div>
  )
}
