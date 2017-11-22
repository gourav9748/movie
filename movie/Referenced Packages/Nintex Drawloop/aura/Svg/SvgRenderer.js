({
    render: function(component, helper) {
        var classname = component.get("v.class");
        var xlinkhref = component.get("v.xlinkHref");
        var mouseOver = component.get("v.mouseOver");
        var mouseOut = component.get("v.mouseOut");
        var onclick = component.get("v.onclick");
        var id = component.get("v.id");
        var display = component.get("v.display");
        var style = component.get("v.style");

        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute('class', classname);
        svg.setAttribute('display', display ? 'inline' : 'none');
        
        if (xlinkhref) {
        	svg.innerHTML = '<use xlink:href="' + xlinkhref + '"></use>';
        } else {
            return;
        }
        if (mouseOver) {
	        svg.setAttribute('onmouseover', mouseOver);
        }
        if (mouseOut) {
	        svg.setAttribute('onmouseout', mouseOut);
        }
        if (onclick) {
            svg.setAttribute('onclick', onclick);
        }
        if (id) {
            svg.setAttribute('id', id);
        }
        if (style) {
            svg.setAttribute('style', style);
        }
        return svg;
    }
})