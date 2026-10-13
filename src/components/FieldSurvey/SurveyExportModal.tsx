import React, { useState } from 'react';
import { Download, Copy, Check, FileSpreadsheet, Database, AlertCircle } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';

const CSV_HEADER = `codigo,nombre_lugar,referencia_edificio,latitud,longitud,foto_url,estado_conservacion,accesibilidad,recipientes_detalle,observaciones`;

const CSV_SAMPLE_ROWS = [
  `P01,Estación Central - Plaza de la Integración,Frente al Pabellón Central / Rectorado,-12.02402,-75.23508,https://ejemplo.com/foto1.jpg,bueno,nivel,"plastico:2;papel_carton:2;no_aprovechable:2;metal:1",Isla ecológica de 4 módulos con techo protector`,
  `P02,Estación Biblioteca Central UNCP,Costado del ingreso a Hemeroteca,-12.02345,-75.23441,https://ejemplo.com/foto2.jpg,bueno,rampa,"papel_carton:3;plastico:2;no_aprovechable:2;peligroso:1",Cuenta con ánfora especial para pilas y papel bond de estudio`,
  `P03,Estación Comedor Universitario,Salida del comedor y lavaderos,-12.02482,-75.23395,https://ejemplo.com/foto3.jpg,regular,nivel,"organico:4;plastico:3;no_aprovechable:3;metal:1",Alta generación de restos orgánicos destinados a compostaje`,
  `P04,Estación Fac. Ingeniería Civil y Arquitectura,Patio de maquetas FICA,-12.02292,-75.23568,https://ejemplo.com/foto4.jpg,bueno,rampa,"papel_carton:3;plastico:2;no_aprovechable:2;vidrio:1",Recipientes reforzados para planos y cartón maquetero`,
  `P05,Estación Puerta Principal N° 01,Acceso peatonal Av. Mariscal Castilla,-12.02545,-75.23552,https://ejemplo.com/foto5.jpg,bueno,rampa,"plastico:3;no_aprovechable:2;papel_carton:1;vidrio:1",Punto de alto tránsito de botellas de agua descartables`,
];

export const SurveyExportModal: React.FC = () => {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const fullCsvText = [CSV_HEADER, ...CSV_SAMPLE_ROWS].join('\n');

  const handleDownloadCsv = () => {
    const blob = new Blob([fullCsvText], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'template_levantamiento_uncp.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyCsv = () => {
    navigator.clipboard.writeText(fullCsvText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 space-y-2">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base sm:text-lg font-black">
            {t('field_survey_title')}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {t('field_survey_desc')}
        </p>
      </div>

      {/* Field Protocol Guidelines */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          Protocolo de Mapeo en Campus (Regla Central)
        </h3>

        <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 font-medium">
            <strong>1 Marcador = 1 Punto de Acopio Oficial:</strong> Cada fila en la plantilla representa una estación física completa (ej. isla de 3 o 4 tachos juntos). Nunca registres tachos aislados individuales como puntos separados si están contiguos.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800">1. Georreferenciación GPS:</span>
              <p className="mt-0.5 text-slate-600">
                Usa Google Maps o una app de GPS en tu celular situado exactamente frente a la estación para tomar latitud y longitud con 5 decimales.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800">2. Conteo de recipientes:</span>
              <p className="mt-0.5 text-slate-600">
                Anota el color y la categoría de cada tacho existente en la estación (blanco, azul, negro, verde, amarillo, marrón, rojo).
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800">3. Estado de conservación:</span>
              <p className="mt-0.5 text-slate-600">
                Clasifica como <em>bueno</em>, <em>regular</em> o <em>malo</em> para alimentar los reportes de mantenimiento de la UNCP.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800">4. Accesibilidad física:</span>
              <p className="mt-0.5 text-slate-600">
                Registra si tiene <em>rampa</em>, acceso <em>a nivel</em> o requiere subir <em>escalones</em>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CSV Template Preview & Action Buttons */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Plantilla CSV Descargable
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? t('csv_copied') : t('copy_csv_template')}</span>
            </button>
            <button
              onClick={handleDownloadCsv}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t('download_csv_template')}</span>
            </button>
          </div>
        </div>

        {/* Code/CSV block */}
        <div className="bg-slate-900 rounded-xl p-3 overflow-x-auto text-[11px] font-mono text-emerald-400 max-h-56">
          <pre>{fullCsvText}</pre>
        </div>

        <p className="text-[11px] text-slate-700">
          * Una vez completado el levantamiento en Excel o Google Sheets, exporta a CSV o reemplaza directamente el archivo <code>src/data/points.json</code>. No requiere compilar ni modificar código TypeScript.
        </p>
      </div>
    </div>
  );
};
