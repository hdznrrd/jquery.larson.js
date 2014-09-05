( function($) {
    $.fn.larson = function(param) {
        this.larson_setup = function(params) {
            /* defaults */
            this.param = {  'on': '<b>x</b>',
                            'off': 'o',
                            'duration': 1000,
                            'size': 8 };

            this.param = jQuery.extend(this.param, params);

            /* init state */
            this.nled = this.param['size'];
            this.rst = this.nled;
            this.cnt = this.nled;
            this.timeout = this.param['duration']/this.nled;
            this.larson_running = false;

            /* setup scanner */
            $(this).find('ul').remove();
            $(this).append('<ul></ul>');
            $(this).find('ul').append( '<li>'+this.param['on']+'</li>' );
            for (i=0; i<this.nled-1; ++i){
                $(this).find('ul').append( '<li>'+this.param['off']+'</li>' );
            }
        }

        this.larson_start = function() {
            this.larson_setup(this.param);
            this.larson_running = true;
            this.larson_advance_bkw(this);
        }

        this.larson_stop = function() {
            this.larson_running = false;
        }

        function kinkywrap(fn, context) {
            /* kinkywrap(fn, context)
             * preserve context across setTimeout invocations.
             *
             * it makes me feel dirty to have to use this.
             * but it's awesome that it works.
             * so lets call it kinky for the time being. 
             */
            return function() { fn.call(context); }    
        }

        this.larson_advance_bkw = function() {
            $(this).find('ul').append( $(this).find('ul>li:first').remove() );
            if(this.larson_running) {
                setTimeout( --this.cnt  ? kinkywrap(this.larson_advance_bkw, this)
                                        : kinkywrap(this.larson_advance_fwd, this),
                            this.timeout);
            }
            this.cnt = this.cnt ? this.cnt : this.rst-1;
        }

        this.larson_advance_fwd = function() {
            $(this).find('ul').prepend( $(this).find('ul>li:last').remove() );
            if(this.larson_running) {
                setTimeout( --this.cnt  ? kinkywrap(this.larson_advance_fwd, this)
                                        : kinkywrap(this.larson_advance_bkw, this),
                            this.timeout);
            }
            this.cnt = this.cnt ? this.cnt : this.rst-1;
        }

        switch(param){
            case 'start': this.larson_start(); break;
            case 'stop': this.larson_stop(); break;
            default: this.larson_setup(param);
        }

        return this;
    }
}
)( jQuery );

