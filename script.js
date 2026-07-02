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
const wp1X = 0.80; const wp1Y = 0.10; const wp1Zoom = 6.0; // WP 1: Flag Peak
const wp2X = 0.75; const wp2Y = 0.60; const wp2Zoom = 2.0; // WP 2: Mid-Flagpole (NEW)
const wp3X = 0.83; const wp3Y = 0.55; const wp3Zoom = 12.0; // WP 3: SOC
const wp4X = 0.70; const wp4Y = 0.65; const wp4Zoom = 12.0; // WP 4: AEO Control Room
const wp5X = 0.59; const wp5Y = 0.57; const wp5Zoom = 3.0; // WP 5: Server Deck (NEW)
const wp6X = 0.50; const wp6Y = 0.45; const wp6Zoom = 1.0; // WP 6: Wide FOV Panorama

// --- CONTEXTUAL ADVISORY DATABASE (Secure Text Readouts) ---
const messages = {
    wp1: `<b>Corporate Flag:</b> The foundation of your Corporate Digital Identity. To an AI model, your business only exists based on the data it was trained on. Historically, this data was harvested from the internet without corporate consent or verified accuracy. ADVSEC protocols allow you to reclaim your data sovereignty and dictate exactly how machines read your domain.<br><br><span style="color: var(--advsec-blue); font-weight: 800; font-family: monospace;">>>> MORE INFO: Why PDF Metadata Matters/PDF Silo Cleaner Page</span>`,
    
    wp2: `Corporate Command: Multi-Layer Infrastructure Protection.<br><br><b>Layer-1 Physical Security SOC:</b> The protection layer for people, property, and physical assets.<br><br><b>Layer-2 AEO Command:</b> The protection layer for your digital domain and corporate brand. We establish a secure, sovereign logic layer or perimeter to ensure your identity remains protected, verifiable, and optimized for friendly AI integration.<br><br><span style="color: var(--advsec-blue); font-weight: 800; font-family: monospace;">>>> MORE INFO: Contact Us</span>`,
    
    wp3: `<b>Security Operations Center (SOC):</b> We create your "Golden Copy" Device List.<br><br>
    If you've ever been through TSA security at an airport, you know that you are in a secure area. There are cameras, scanners, and guards. It can be intimidating, but all those individual devices are connected to a network to create a unified system. ADVSEC documents all of those devices.<br><br>
    Because your specific layout of cameras, switches, and infrastructure is completely unique to your facility, the system metadata we capture is uniquely valuable to you—establishing the exact documentation required to build a custom, internal AI (RAG) help desk tomorrow.<br><br><span style="color: var(--advsec-blue); font-weight: 800; font-family: monospace;">>>> MORE INFO: Camera Infrastructure Page</span>`,
    
    wp4: `<b>Answer Engine Optimization (AEO) Command:</b> This is where we put on our security goggles and address the corporate digital domain.<br><br>
    1- Secure the perimeter.<br>
    2- Plug the holes of leaky information.<br>
    3- Create the house rules and logic maps for approved guests (AI models, custom bots of the future, etc.).<br><br>
    Nobody can write a script for an AI model to read verbatim. However, we can feed the AI models all the proper, verified facts. This ensures that when the AI generates its own script, it is factually accurate and protects the corporate brand.<br><br><span style="color: var(--advsec-blue); font-weight: 800; font-family: monospace;">>>> MORE INFO: ADVSEC Solutions & Contact Us</span>`,
    
    wp5: `<b>The Corporate Digital Vault:</b> The cryptographic anchor of your domain.<br><br>
    Sitting at the root level, this secured folder serves your Corporate Digital Identity directly to AI models. It houses your site's structural files as secured PDFs, acting as the Single Source of Truth (SSoT) to validate documents found on the internet.<br><br>
    <b>Closing the AI Semantic Loop:</b><br>
    <span style="font-size: 0.9em; display: block; margin-top: 5px;">
    1- AI discovers a PDF in the wild or via user prompt.<br>
    2- AI parses the metadata to find the Copyright Source URL.<br>
    3- AI checks the root robots.txt, following the RSL Standard directory to confirm access.<br>
    4- Authorized AI enters the vault, validates the Sovereign Logic Containers, and indexes a honeypot of verified data.
    </span><br>
    This closed loop allows any AI to "call home," check IDs, and cryptographically prove the document's origin.<br><br><span style="color: var(--advsec-blue); font-weight: 800; font-family: monospace;">>>> MORE INFO: Flagposting Framework v1.0 Page</span>`,
    
    wp6: `<b>The ADVSEC Standard:</b> Corporate Digital Identity and Physical IP Security Infrastructure, operating in concert.<br><br>
    The AI Double-Edged Sword: Physical security ensures employees feel safe at work; digital security ensures the corporate brand survives and employees have a place to work. AI impacts both. ADVSEC provides the technical command to control this landscape through a strict line of demarcation.<br><br>
    [+] The Public Domain: Structured to feed verified facts to friendly AI models, protecting the corporate brand.<br>
    [+] The Internal Fortress: Air-gapped, yet optimized for secure AI deployment when ready.<br><br><span style="color: var(--advsec-blue); font-weight: 800; font-family: monospace;">>>> MORE INFO: Domain Security & Camera Infrastructure Pages</span>`,
};

viewer.addHandler('open', function() {
    viewer.viewport.panTo(new OpenSeadragon.Point(wp1X, wp1Y), true);
    viewer.viewport.zoomTo(wp1Zoom, null, true);
    updateOverlay(messages.wp1, true);
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

// --- FLUID 5-STAGE SCROLL TRACKING MATRIX ---
window.addEventListener('scroll', function() {
    const scrollContainer = document.querySelector('.viewport-command-deck');
    if (!scrollContainer) return;

    const containerTop = scrollContainer.offsetTop;
    const containerHeight = scrollContainer.offsetHeight - window.innerHeight;
    const scrolled = window.scrollY - containerTop;
    
    let progress = scrolled / containerHeight;
    progress = Math.max(0, Math.min(1, progress)); 

    let currentX, currentY, currentZoom;

    // Segment 1: WP1 to WP2 (0% to 20%)
    if (progress <= 0.20) {
        let sectorProgress = progress / 0.20;
        currentX = wp1X + (wp2X - wp1X) * sectorProgress;
        currentY = wp1Y + (wp2Y - wp1Y) * sectorProgress;
        currentZoom = wp1Zoom + (wp2Zoom - wp1Zoom) * sectorProgress;
        if (progress < 0.05) updateOverlay(messages.wp1, true);
        else if (progress > 0.15) updateOverlay(messages.wp2, true);
        else updateOverlay("", false);
    } 
    // Segment 2: WP2 to WP3 (20% to 40%)
    else if (progress > 0.20 && progress <= 0.40) {
        let sectorProgress = (progress - 0.20) / 0.20;
        currentX = wp2X + (wp3X - wp2X) * sectorProgress;
        currentY = wp2Y + (wp3Y - wp2Y) * sectorProgress;
        currentZoom = wp2Zoom + (wp3Zoom - wp2Zoom) * sectorProgress;
        if (progress < 0.25) updateOverlay(messages.wp2, true);
        else if (progress > 0.35) updateOverlay(messages.wp3, true);
        else updateOverlay("", false);
    } 
    // Segment 3: WP3 to WP4 (40% to 60%)
    else if (progress > 0.40 && progress <= 0.60) {
        let sectorProgress = (progress - 0.40) / 0.20;
        currentX = wp3X + (wp4X - wp3X) * sectorProgress;
        currentY = wp3Y + (wp4Y - wp3Y) * sectorProgress;
        currentZoom = wp3Zoom + (wp4Zoom - wp3Zoom) * sectorProgress;
        if (progress < 0.45) updateOverlay(messages.wp3, true);
        else if (progress > 0.55) updateOverlay(messages.wp4, true);
        else updateOverlay("", false);
    }
    // Segment 4: WP4 to WP5 (60% to 80%)
    else if (progress > 0.60 && progress <= 0.80) {
        let sectorProgress = (progress - 0.60) / 0.20;
        currentX = wp4X + (wp5X - wp4X) * sectorProgress;
        currentY = wp4Y + (wp5Y - wp4Y) * sectorProgress;
        currentZoom = wp4Zoom + (wp5Zoom - wp4Zoom) * sectorProgress;
        if (progress < 0.65) updateOverlay(messages.wp4, true);
        else if (progress > 0.75) updateOverlay(messages.wp5, true);
        else updateOverlay("", false);
    }
    // Segment 5: WP5 to WP6 (80% to 100%)
    else {
        let sectorProgress = (progress - 0.80) / 0.20;
        currentX = wp5X + (wp6X - wp5X) * sectorProgress;
        currentY = wp5Y + (wp6Y - wp5Y) * sectorProgress;
        currentZoom = wp5Zoom + (wp6Zoom - wp5Zoom) * sectorProgress;
        if (progress < 0.85) updateOverlay(messages.wp5, true);
        else if (progress > 0.95) updateOverlay(messages.wp6, true);
        else updateOverlay("", false);
    }

    viewer.viewport.panTo(new OpenSeadragon.Point(currentX, currentY), false);
    viewer.viewport.zoomTo(currentZoom, null, false);
});