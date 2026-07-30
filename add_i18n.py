#!/usr/bin/env python3
"""
Script para agregar atributos data-i18n a archivos HTML automáticamente.
"""

import os
import re
from pathlib import Path

# Mapeo de textos comunes a claves i18n
I18N_MAP = {
    # Navigation
    'Institución': 'nav.institucion',
    'Operaciones': 'nav.operaciones',
    'Pilotos': 'nav.pilotos',
    'Brigadas': 'nav.brigadas',
    'Comunidad': 'nav.comunidad',
    'Reglamento': 'nav.reglamento',
    'REDES': 'nav.redes',
    'Ingresar': 'nav.login',
    'Cerrar sesión': 'nav.logout',
    'Login': 'nav.login',
    
    # Common
    'Volver': 'common.back',
    'Cargando…': 'common.loading',
    'Cargando...': 'common.loading',
    'Error al cargar datos': 'common.error',
    
    # Hero
    'Volamos por los cielos de <em><br>Argentina</em>, en simulador.': 'hero.title',
    'Comunidad de simulación aérea virtual dedicada a recrear, con respeto y camaradería, las aeronaves y misiones que a lo largo de la historia formaron a los pilotos de la FAA. Miembro certificado de VATSIM Special Operations (VSOA).': 'hero.lead',
    'Sumarme a la FAAV': 'hero.btn.join',
    'Ver operaciones': 'hero.btn.ops',
    
    # Mision
    'Un lugar de entretenimiento, disciplina y compañerismo': 'mision.title',
    'La FAAV es un espacio de simulación aérea sobre Microsoft Flight Simulator, Prepar3D y DCS World, con especial interés en las aeronaves de combate y transporte que supieron –y siguen– vistiendo los colores celeste y blanco.': 'mision.p1',
    'Recreamos procedimientos, jerarquías y misiones reales con el máximo respeto, pero sin perder de vista que esto es, ante todo, un pasatiempo: acá el compañerismo siempre pesa más que el rango.': 'mision.p2',
    'Cada piloto se instruye, elige una brigada virtual y despega junto a una tripulación que entiende que volar en grupo es mucho mejor que volar solo.': 'mision.p3',
    'Aviso institucional': 'mision.notice',
    'La FAAV es una organización de aviación virtual sin fines de lucro y no posee ningún tipo de relación con el organismo oficial de la Fuerza Aérea de la República Argentina. Para conocer la institución real, visitá el ': 'mision.notice',
    'sitio oficial': 'mision.notice',
    
    # Operaciones
    'Todo lo que necesitás<br>para volar con nosotros': 'ops.title',
    'Recursos, material y redes en las que operamos activamente como organización certificada.': 'ops.subtitle',
    'Ingresar': 'ops.card.login.title',
    'Accedé con tu usuario de la FAAV a escenarios, aeronaves, texturas y material exclusivo para pilotos.': 'ops.card.login.desc',
    'Sala de pilotos': 'ops.card.login.link',
    'VATSIM & VSOA': 'ops.card.vatsim.title',
    'Registrados como organización de Operaciones Especiales de VATSIM desde 2022, operando bajo su normativa.': 'ops.card.vatsim.desc',
    'vatsim.net': 'ops.card.vatsim.link',
    'OPERACIONES': 'ops.card.ops.title',
    'Documentación, reglamentos, briefings y todo lo necesario para las operaciones de la FAAV.': 'ops.card.ops.desc',
    'Ver operaciones': 'ops.card.ops.link',
    'Vínculos útiles': 'ops.card.links.title',
    'Enlaces a otras fuerzas armadas y aerolíneas virtuales amigas, y a recursos útiles para tu simulador.': 'ops.card.links.desc',
    'Explorar': 'ops.card.links.link',
    
    # Brigadas
    'Conoce nuestras Brigadas': 'brigadas.title',
    'Al ingresar, cada piloto se incorpora a una de las brigadas aéreas virtuales, reflejando la organización territorial real de la Fuerza Aérea Argentina.': 'brigadas.subtitle',
    
    # Media
    'Mirá cómo volamos': 'media.title',
    'Videos recomendados del canal y las últimas publicaciones de Instagram de la FAAV.': 'media.subtitle',
    'Video destacado del canal': 'media.youtube.featured',
    'Canal de YouTube': 'media.youtube.channel',
    'Vuelos en formación, demos y coberturas de nuestros eventos y operaciones conjuntas.': 'media.youtube.desc',
    'Ver canal completo': 'media.youtube.link',
    'Instagram @faav_arg': 'media.instagram.title',
    'Capturas de cabina, formaciones y el día a día de las brigadas.': 'media.instagram.desc',
    'Ir al perfil': 'media.instagram.link',
    'TikTok @faav_arg': 'media.tiktok.title',
    'Clips de cabina, formaciones y el día a día en formato corto.': 'media.tiktok.desc',
    
    # Tracker
    'Rastreador de pilotos': 'tracker.title',
    'Estado en vivo de la red de VATSIM: quién está volando ahora mismo y a dónde.': 'tracker.subtitle',
    'en vuelo ahora': 'tracker.online',
    'Cargando roster…': 'tracker.loading',
    
    # Voces
    'FAAV OPS - FRECUENCIA COMUNIDAD': 'voces.title',
    '"Un grupo que crea y fortalece lazos de amistad, unidos por la simulación de las actividades aeronáuticas de nuestra querida Fuerza Aérea Argentina."': 'voces.quote',
    '— Comunidad FAAV': 'voces.author',
    
    # Calendario
    'Calendario de eventos': 'calendario.title',
    'Próximos eventos de VATSIM y operaciones especiales de la FAAV.': 'calendario.subtitle',
    'FAAV': 'calendario.tab.faav',
    'Eventos VSOA': 'calendario.tab.vsoa',
    'VATSIM Argentina': 'calendario.tab.argar',
    'Eventos de la FAAV, de la red VATSIM VSOA (Sudamérica) y de VATSIM Argentina. Los horarios se muestran en hora local de Argentina (ART, UTC-3).': 'calendario.note',
    
    # Sumate
    'Cómo sumarte a la FAAV': 'sumate.title',
    'Sin costo, sin requisitos de hardware especiales. Sólo ganas de volar y compañerismo.': 'sumate.subtitle',
    'CONTACTO': 'sumate.step1.title',
    'Escribinos por Instagram para conocer los próximos pasos de ingreso y resolver tus dudas.': 'sumate.step1.desc',
    'INSTRUCCIÓN': 'sumate.step2.title',
    'Formación inicial': 'sumate.step2.title',
    'Un breve proceso de instrucción para conocer procedimientos, comunicaciones y la organización interna. La formación será en Tecnam P2002 y Texan II.': 'sumate.step2.desc',
    'DESTINO': 'sumate.step3.title',
    'Asignación de brigada': 'sumate.step3.title',
    'Vos elegís la brigada que quieras. Si elegís Caza, antes realizás el CEPAC; si elegís Transporte, realizás el CEPAT.': 'sumate.step3.desc',
    'Escribir por Instagram': 'sumate.btn.instagram',
    'Ver reglamento': 'sumate.btn.reglamento',
    'Formulario de Inscripción': 'sumate.btn.inscripcion',
    
    # Footer
    'FAAV - VSOA': 'footer.brand',
    'FUERZA AÉREA ARGENTINA VIRTUAL - VATSIM SPECIAL OPERATION ASOCIATED': 'footer.tagline',
    'Comunidad de simulación aérea sin fines de lucro, con presencia federal en brigadas de todo el país.': 'footer.desc',
    'Institución': 'footer.institucion',
    'Bienvenida': 'footer.bienvenida',
    'Brigadas': 'footer.brigadas',
    'Reglamento': 'footer.reglamento',
    'Operaciones': 'footer.operaciones',
    'Sala de pilotos': 'footer.sala_pilotos',
    'Material aéreo': 'footer.material_aereo',
    'Escenarios': 'footer.escenarios',
    'Redes': 'footer.redes',
    
    # Pilotos page
    'Sala de pilotos': 'pilotos.title',
    'Bienvenido,': 'pilotos.welcome',
    'Escenarios': 'pilotos.scenarios.title',
    'Escenarios Prepar3D': 'pilotos.scenarios.p3d',
    'Paquetes de aeropuertos y scenery packs para Prepar3D. Incluye bases aéreas, aeropuertos civiles y escenarios especiales de la FAAV.': 'pilotos.scenarios.p3d.desc',
    'Ir a descargas': 'pilotos.scenarios.p3d.link',
    'Escenarios MFS 2020/24': 'pilotos.scenarios.mfs',
    'Paquetes de aeropuertos y scenery packs para Microsoft Flight Simulator 2020/24. Incluye bases aéreas, aeropuertos civiles y escenarios especiales de la FAAV.': 'pilotos.scenarios.mfs.desc',
    'Aviones': 'pilotos.aircraft.title',
    'Aviones Prepar3D': 'pilotos.aircraft.p3d',
    'Aeronaves disponibles para Prepar3D: IA-63 Pampa, A-4 Skyhawk, FMA SAIA 90, y más. Aeronaves aprobadas para operaciones.': 'pilotos.aircraft.p3d.desc',
    'Aviones MFS 2020/24': 'pilotos.aircraft.mfs',
    'Aeronaves disponibles para Microsoft Flight Simulator 2020/24: IA-63 Pampa, A-4 Skyhawk, FMA SAIA 90, y más.': 'pilotos.aircraft.mfs.desc',
    'Liveries': 'pilotos.liveries.title',
    'Liveries Prepar3D': 'pilotos.liveries.p3d',
    'Pinturas oficiales de la FAAV y de las brigadas para Prepar3D. Material texturas de alta calidad.': 'pilotos.liveries.p3d.desc',
    'Liveries MFS 2020/24': 'pilotos.liveries.mfs',
    'Pinturas oficiales de la FAAV y de las brigadas para Microsoft Flight Simulator 2020/24.': 'pilotos.liveries.mfs.desc',
    'MTL\'s': 'pilotos.mtl.title',
    'MTL Prepar3D': 'pilotos.mtl.p3d',
    'Modelos de tráfico en línea (MTL) para Prepar3D. Material compartido para operaciones con tráfico virtual en VATSIM.': 'pilotos.mtl.p3d.desc',
    'MTL MFS 2020/24': 'pilotos.mtl.mfs',
    'Modelos de tráfico en línea (MTL) para Microsoft Flight Simulator 2020/24. Material compartido para VATSIM.': 'pilotos.mtl.mfs.desc',
    'Material Aéreo': 'pilotos.material.title',
    'Manuales de vuelo': 'pilotos.material.manuales',
    'POH, checklists, y guías de operación de algunas aeronaves de la FAAV. Material de estudio para pilotos.': 'pilotos.material.manuales.desc',
    'Procedimientos': 'pilotos.material.procedimientos',
    'Procedimientos estándar, cartas de aproximación, y briefings de operaciones para vuelos.': 'pilotos.material.procedimientos.desc',
    'Material Escuela': 'pilotos.escuela.title',
    'PROGRAMA DE ENTRENAMIENTO': 'pilotos.escuela.programa',
    'Material de entrenamiento completo: Tecnam P2002 y Texan II. Temarios, procedimientos y guías de estudio.': 'pilotos.escuela.programa.desc',
    'Documentación': 'pilotos.docs.title',
    'Reglamento de vuelo': 'pilotos.docs.reglamento',
    'Normativa interna de la FAAV: reglas de vuelo, procedimientos de comunicación, y estándares de operación.': 'pilotos.docs.reglamento.desc',
    'Guía del nuevo piloto': 'pilotos.docs.guia',
    'Tutorial de inicio: cómo configurar tu simulador, unirte a VATSIM, y volar con la FAAV paso a paso.': 'pilotos.docs.guia.desc',
    'VATSIM Argentina': 'pilotos.docs.vatsim_ar',
    'Documentación de la división Argentina de VATSIM: reglamentos, procedimientos, y material de referencia.': 'pilotos.docs.vatsim_ar.desc',
    'VATSIM VSOA': 'pilotos.docs.vsoa',
    'Documentación de VATSIM Special Operations (VSOA): normativa, estándares, y material para operaciones especiales.': 'pilotos.docs.vsoa.desc',
    
    # Pilotos online
    'Pilotos en línea': 'pilotos_online.title',
    'Pilotos de la FAAV volando ahora mismo en VATSIM.': 'pilotos_online.subtitle',
    'en vuelo ahora': 'pilotos_online.online',
    'Ver todos los pilotos': 'pilotos_online.btn_all',
    'No hay pilotos de la FAAV volando en este momento.': 'pilotos_online.none',
    
    # Todos los pilotos
    'Listado de pilotos': 'todos.title',
    'Pilotos registrados de la FAAV.': 'todos.subtitle',
    'pilotos en el roster': 'todos.total',
    'en vuelo ahora': 'todos.online',
    'Callsign': 'todos.table.callsign',
    'Nombre': 'todos.table.nombre',
    'Indicativo': 'todos.table.indicativo',
    'Brigada': 'todos.table.brigada',
    'CID VATSIM': 'todos.table.cid',
    'Estado': 'todos.table.estado',
    
    # Piloto detail
    'Piloto': 'piloto.title',
    'Volver a pilotos en línea': 'piloto.back_online',
    'Volver a la lista de pilotos': 'piloto.back_all',
    'Cargando…': 'piloto.loading',
    'No se pudo encontrar el piloto solicitado.': 'piloto.error',
    'No está volando en este momento.': 'piloto.offline',
    'Estadísticas': 'piloto.stats.title',
    'Horas voladas': 'piloto.stats.hours',
    'Último vuelo': 'piloto.stats.last_flight',
    'Aeropuerto + usado': 'piloto.stats.fav_airport',
    'Avión + usado': 'piloto.stats.fav_aircraft',
    'Últimos Vuelos': 'piloto.flights.title',
    'Callsign': 'piloto.flights.callsign',
    'Aeronave': 'piloto.flights.aircraft',
    'Vuelo': 'piloto.flights.route',
    'Fecha': 'piloto.flights.date',
    'Remark': 'piloto.flights.remark',
    'Callsign VATSIM': 'piloto.details.callsign',
    'Aeronave': 'piloto.details.aircraft',
    'Ruta': 'piloto.details.route',
    'Altitud': 'piloto.details.altitude',
    'Velocidad': 'piloto.details.speed',
    'Rumbo': 'piloto.details.heading',
    'Squawk': 'piloto.details.squawk',
    
    # Reglamento
    'Reglamento de Vuelo': 'reglamento.title',
    'Normativa interna de la FAAV para operaciones en VATSIM.': 'reglamento.subtitle',
    
    # Inscripcion
    'Formulario de Inscripción': 'inscripcion.title',
    'Completá tus datos para iniciar el proceso de ingreso a la FAAV.': 'inscripcion.subtitle',
    
    # Login
    'Iniciar Sesión': 'login.title',
    'Accedé a la sala de pilotos con tu usuario.': 'login.subtitle',
    
    # Redes
    'Redes Sociales y Comunidad': 'redes.title',
    'Conectá con la comunidad FAAV': 'redes.subtitle',
    
    # Operaciones
    'Operaciones': 'operaciones.title',
    'Documentación y recursos operativos': 'operaciones.subtitle',
    
    # Brigada
    'Brigada': 'brigada.title',
    'Ubicación': 'brigada.location',
    'Aeronaves asignadas': 'brigada.aircraft',
    'Historia': 'brigada.history',
    'Contacto': 'brigada.contact',
}

def add_i18n_to_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Add i18n script if not present
    if 'i18n.js' not in content and 'script.js' in content:
        content = content.replace(
            '<script src="../JS/script.js"></script>',
            '<script src="../JS/i18n.js"></script>\n<script src="../JS/script.js"></script>'
        )
    
    # Add lang switcher to header if not present
    if 'lang-switcher' not in content:
        # Find navcta div and add switcher before burger button
        if 'navcta' in content:
            content = content.replace(
                '<a href="login.html" class="btn btn-ghost">Ingresar</a>\n    <button class="burger"',
                '<a href="login.html" class="btn btn-ghost" data-i18n="nav.login">Ingresar</a>\n    <button id="lang-switcher" class="btn btn-ghost lang-btn" aria-label="Cambiar idioma" style="padding:8px 12px;font-size:12px;font-family:\'JetBrains Mono\',monospace;">ES</button>\n    <button class="burger"'
            )
            content = content.replace(
                '<a href="login.html" class="btn btn-ghost" id="navLogout"><span>Cerrar sesión</span></a>\n    <button class="burger"',
                '<a href="login.html" class="btn btn-ghost" id="navLogout" data-i18n="nav.logout"><span>Cerrar sesión</span></a>\n    <button id="lang-switcher" class="btn btn-ghost lang-btn" aria-label="Cambiar idioma" style="padding:8px 12px;font-size:12px;font-family:\'JetBrains Mono\',monospace;">ES</button>\n    <button class="burger"'
            )
            content = content.replace(
                '<div class="navcta">\n    <button class="burger"',
                '<div class="navcta">\n    <button id="lang-switcher" class="btn btn-ghost lang-btn" aria-label="Cambiar idioma" style="padding:8px 12px;font-size:12px;font-family:\'JetBrains Mono\',monospace;">ES</button>\n    <button class="burger"'
            )
    
    # Simple text replacement for known strings (only exact matches in tag content)
    for text, key in I18N_MAP.items():
        if text in content:
            # Replace in tag content: >text<
            pattern = '>' + re.escape(text) + '<'
            replacement = ' data-i18n="' + key + '">' + text + '<'
            # Only replace if not already has data-i18n
            if 'data-i18n="' + key + '"' not in content:
                content = content.replace('>' + text + '<', ' data-i18n="' + key + '">' + text + '<')
    
    # Fix title tag
    if '<title>' in content and 'data-i18n' not in content.split('<title>')[1].split('</title>')[0]:
        content = re.sub(
            r'<title>([^<]+)</title>',
            r'<title data-i18n="brand.name">\1</title>',
            content
        )
    
    # Fix headings
    for text, key in I18N_MAP.items():
        if text in content:
            # h1, h2, h3, h4
            for tag in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
                pattern = '<' + tag + '>' + re.escape(text) + '</' + tag + '>'
                replacement = '<' + tag + ' data-i18n="' + key + '" data-i18n-html="true">' + text + '</' + tag + '>'
                if pattern in content and 'data-i18n="' + key + '"' not in content:
                    content = content.replace(pattern, replacement)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated: {filepath}")
        return True
    return False

def main():
    html_dir = Path('HTML')
    updated = 0
    
    for html_file in html_dir.glob('*.html'):
        if add_i18n_to_file(html_file):
            updated += 1
    
    for html_file in (html_dir / 'brigadas').glob('*.html'):
        if add_i18n_to_file(html_file):
            updated += 1
    
    for html_file in (html_dir / 'storage').rglob('*.html'):
        if add_i18n_to_file(html_file):
            updated += 1
    
    print(f"\nTotal files updated: {updated}")

if __name__ == '__main__':
    main()