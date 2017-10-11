exports.development = {
    'webserver': {
        'port': 9001,
        'protocol': 'http'
    },
    'database': {
        'pool': {
            'max': 20,
            'min': 1
        },
        'debug': true,
        'client': 'pg',
        'connection': {
            'host': '127.0.0.1',
            'port': '5432',
            'user': 'root',
            'database': 'rapido',
            'password': 'rapido'
        }
    },
    'logger': {
        'file': {
            'level': 'debug',
            'colorize': true,
            'timestamp': true,
            'filename': 'logs/rapido.log',
            'maxsize': 10485760,
            'maxfiles': 5,
            'json': false,
            'prettyPrint': true
        },
        'console': {
            'level': 'debug',
            'colorize': true,
            'timestamp': true,
            'prettyPrint': true
        }
    },
    'rapido-client-url': 'http://localhost:9001',
    'email': {
        'from': 'parthapratim.mallik@ca.com',
        'host': 'smtp.office365.com',
        'secure': true,
        'port': 587,
        'auth': {
            'user': 'malpa07@ca.com',
            'pass': '#Aka5hyapC'
        },
        'tls': { 'ciphers': 'SSLv3' }
    },
    'jwt': {
        'secret': 'Rap1d0S@cr@t$!c@ntm@k3',
        'expiry': '24h'
    }
};

exports.production = {
    'webserver': {
        'port': 9001,
        'protocol': 'http'
    },
    'database': {
        'pool': {
            'max': 20,
            'min': 1
        },
        'debug': false,
        'client': 'pg',
        'connection': {
            'host': '127.0.0.1',
            'port': '5432',
            'user': 'root',
            'database': 'rapido',
            'password': 'rapido'
        }
    },
    'logger': {
        'file': {
            'level': 'error',
            'colorize': true,
            'timestamp': true,
            'filename': 'logs/rapido.log',
            'maxsize': 10485760,
            'maxfiles': 5,
            'json': false,
            'prettyPrint': true
        },
        'console': {
            'level': 'info',
            'colorize': true,
            'timestamp': true,
            'prettyPrint': true
        }
    },
    'rapido-client-url': 'https://rapido.ca.com',
    'email': {
        'from': 'carapidomail@gmail.com',
        'host': 'smtp.gmail.com',
        'secureConnection': true,
        'port': '465',
        'transportMethod': 'SMTP',
        'auth': {
            'user': 'carapidomail@gmail.com',
            'pass': 'test123!@'
        }
    },
    'jwt': {
        'secret': 'Rap1d0S@cr@t$!c@ntm@k3',
        'expiry': '24h'
    }
};
