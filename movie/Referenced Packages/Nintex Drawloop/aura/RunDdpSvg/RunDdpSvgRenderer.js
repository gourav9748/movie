({
    afterRender : function(component, helper) {
        var svg = component.find('svgContent');
        var valueEncoded = svg.getElement().innerHTML;
        var value = valueEncoded.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        value = value.replace('<![CDATA[', '').replace(']]>', '');
		svg.getElement().innerHTML = value;
    }
})