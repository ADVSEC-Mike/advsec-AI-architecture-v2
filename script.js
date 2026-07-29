// --- INITIALIZE ADVSEC SCROLL ENGINE CONTROLLER ---
const viewer = OpenSeadragon({
    id: "openseadragon-viewer",
    prefixUrl: "https://cdnjs.cloudflare.com/ajax/libs/openseadragon/4.1.0/images/",
    tileSources: "Main_image_v2.dzi",
    
    showNavigationControl: false,  
    wrapHorizontal: false,         
    wrapVertical: false,
    
    defaultZoomLevel: 1.0,         
    minZoomImageRatio: 1.0,        
    maxZoomLevel: 12,              
    visibilityRatio: 1.0,

    // Smooth Mechanical Braking Parameters
    animationTime: 0.5,         
    springStiffness: 9.0        
});

// --- TECHNICAL WAYPOINT REGISTRY (6 Waypoints) ---
const wp1X = 0.50; const wp1Y = 0.42; const wp1Zoom = 1.0; // WP 1: Wide FOV
const wp2X = 0.85; const wp2Y = 0.60; const wp2Zoom = 5.0; // WP 2: SOC
const wp3X = 0.68; const wp3Y = 0.63; const wp3Zoom = 3.5; // WP 3: AEO 

// --- CONTEXTUAL ADVISORY DATABASE (Secure Text Readouts) ---
// NOTE: labeled by PURPOSE, not by wp-number -- confirm which coordinate
// actually shows which part of the image, then assign accordingly. The
// zoom levels suggest wp2 (zoom 10, tight) = the SOC cutaway, and
// wp3 (zoom 3, moderate) = a broader shot, but verify against the art itself.
const messages = {
    // PURPOSE: Opening / whole-picture establishing shot
    overview: `<b>A Complete Security Operation.</b><br><br>Physical security and digital security used to be two separate jobs. We built ADVSEC on the idea that they're actually one job -- protecting what's yours, whether it's a building or a document.<br><br><span style="color: var(--advsec-blue); font-weight: 800; font-family: monospace;">>>> Keep scrolling</span>`,

    // PURPOSE: Heritage / Camera Fax
    heritage: `<b>Where We Started: Physical Security.</b><br><br>Since 1991, we've documented and audited IP-based security video systems -- cameras, switches, recorders, all the infrastructure most companies lose track of over time. That same discipline for knowing exactly what you have, and proving it, is where everything else we do began.<br><br><span style="color: var(--advsec-blue); font-weight: 800; font-family: monospace;">>>> MORE INFO: Camera FAX Page</span>`,

    // PURPOSE: The focus -- Silo Cleaner, paying off into the sealed-vault visual
    focus: `<b>The Same Discipline, Applied to Your Documents.</b><br><br>Your PDF library deserves the same level of proof your physical assets get. The PDF Silo Cleaner rebuilds ownership data into every file in your library, then seals each one with a real, verifiable digital signature -- so an AI reading your documents can trust them the same way it would trust a verified building.<br><br><span style="color: var(--advsec-blue); font-weight: 800; font-family: monospace;">>>> MORE INFO: PDF Silo Cleaner Page</span>`,
};

viewer.addHandler('open', function() {
    viewer.viewport.panTo(new OpenSeadragon.Point(wp1X, wp1Y), true);
    viewer.viewport.zoomTo(wp1Zoom, null, true);
    updateOverlay(messages.overview, true);
});

function updateOverlay(text, show) {
    const overlay = document.getElementById('tactical-overlay');
    const msgBox = document.getElementById('overlay-message');
    if (!overlay || !msgBox) return;

    if (show) {
        // Changed from innerText to innerHTML to allow the links to render
        msgBox.innerHTML = text;
        overlay.className = "overlay-visible";
    } else {
        overlay.className = "overlay-hidden";
    }
}

// --- FLUID 2-STAGE SCROLL TRACKING MATRIX (3 waypoints = 2 segments) ---
window.addEventListener('scroll', function() {
    const scrollContainer = document.querySelector('.viewport-command-deck');
    if (!scrollContainer) return;

    const containerTop = scrollContainer.offsetTop;
    const containerHeight = scrollContainer.offsetHeight - window.innerHeight;
    const scrolled = window.scrollY - containerTop;
    
    let progress = scrolled / containerHeight;
    progress = Math.max(0, Math.min(1, progress)); 

    let currentX, currentY, currentZoom;

    // Segment 1: WP1 to WP2 (0% to 50%)
    if (progress <= 0.50) {
        let sectorProgress = progress / 0.50;
        currentX = wp1X + (wp2X - wp1X) * sectorProgress;
        currentY = wp1Y + (wp2Y - wp1Y) * sectorProgress;
        currentZoom = wp1Zoom + (wp2Zoom - wp1Zoom) * sectorProgress;
        if (progress < 0.125) updateOverlay(messages.overview, true);
        else if (progress > 0.375) updateOverlay(messages.heritage, true);
        else updateOverlay("", false);
    }
    // Segment 2: WP2 to WP3 (50% to 100%)
    else {
        let sectorProgress = (progress - 0.50) / 0.50;
        currentX = wp2X + (wp3X - wp2X) * sectorProgress;
        currentY = wp2Y + (wp3Y - wp2Y) * sectorProgress;
        currentZoom = wp2Zoom + (wp3Zoom - wp2Zoom) * sectorProgress;
        if (progress < 0.625) updateOverlay(messages.heritage, true);
        else if (progress > 0.875) updateOverlay(messages.focus, true);
        else updateOverlay("", false);
    }

    viewer.viewport.panTo(new OpenSeadragon.Point(currentX, currentY), false);
    viewer.viewport.zoomTo(currentZoom, null, false);
});