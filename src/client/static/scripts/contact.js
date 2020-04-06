(function ($) {
    $.fn.serializeFormJSON = function () {

        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
})(jQuery);

$(document).ready(function() {
    function clearValidation(){
        $(".form-control").removeClass("is-invalid");
    }

    function hideResponseMessages(){
        $(".alert").addClass("d-none");
    }

    function validateField(formValues, name){
        if(!formValues[name]){
            $(".form-control[name=" + name + "]").addClass("is-invalid");
            return false;
        }
        else {
            return true;
        }
    }

    function onSuccess(){
        $(".alert-success").removeClass("d-none");
    }

    function onError(){
        $(".alert-danger").removeClass("d-none");
    }

    const requiredFields = ["name", "company", "email", "telephone"];

    $("form").submit(function(ev){
        ev.preventDefault();
        clearValidation();
        hideResponseMessages();
        const values = $("form").serializeFormJSON();
        console.log(values);
        console.log("form submit");
        const hasErrors =
            (requiredFields
                .map(function(rf){
                    return validateField(values, rf);
                })
                .filter(r => !r)
                .length) > 0;

        if(!hasErrors){
            $.ajax({
                "type":"POST",
                "url":"https://cncsolutions-backend.azurewebsites.net/umbraco/api/contact/post",
                "data": JSON.stringify(values),
                "contentType": "application/json",
                "success": onSuccess,
                "error": onError
            })
        }
    })
})