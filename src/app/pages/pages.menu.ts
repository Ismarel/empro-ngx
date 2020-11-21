export const PAGES_MENU = [
    {
        path: 'pages',
        children: [
            {
                path: 'dashboard',
                data: {
                    menu: {
                        title: 'general.menu.dashboard',
                        icon: 'ion-android-home',
                        selected: false,
                        expanded: false,
                        order: 0
                    }
                }
            },
            {
                path: 'miempresa',
                data: {
                    menu: {
                        title: 'general.menu.miempresa',
                        icon: 'ion-android-settings',
                        selected: false,
                        expanded: false,
                        order: 100,
                    }
                },
                children: [
                    {
                        path: 'empresa',
                        data: {
                            menu: {
                                title: 'general.menu.informacion',
                            },
                        },
                    },
                    {
                        path: 'sucursales',
                        data: {
                            menu: {
                                title: 'Sucursales',
                            },
                        },
                    },
                    {
                        path: 'conceptos',
                        data: {
                            menu: {
                                title: 'general.menu.conceptos',
                            },
                        },
                    },
                    {
                        path: 'clientes',
                        data: {
                            menu: {
                                title: 'general.menu.clientes',
                            },
                        },
                    },
                    {
                        path: 'usuarios',
                        data: {
                            menu: {
                                title: 'general.menu.usuarios',
                            },
                        },
                    },
                    {
                        path: 'proveedores',
                        data: {
                            menu: {
                                title: 'general.menu.proveedores',
                            },
                        },
                    },
                ],
            },
            {
                path: 'bancos',
                data: {
                    menu: {
                        title: 'general.menu.bancos',
                        icon: 'fa fa-university',
                        selected: false,
                        expanded: false,
                        order: 250,
                    }
                },
                children: [
                    {
                        path: 'cuentas',
                        data: {
                            menu: {
                                title: 'Cuentas',
                            }
                        },
                        children: [
                            {
                                path: 'cuentasgestion',
                                data: {
                                    menu: {
                                        title: 'Gestión de cuentas',
                                    }
                                }
                            },
                            {
                                path: 'tarjetasgestion',
                                data: {
                                    menu: {
                                        title: 'Gestión de tarjetas',
                                    }
                                }
                            },
                            {
                                path: 'chequerasgestion',
                                data: {
                                    menu: {
                                        title: 'Gestión de chequeras',
                                    }
                                }
                            },
                            {
                                path: 'estadoscuenta',
                                data: {
                                    menu: {
                                        title: 'Estados de cuenta',
                                    }
                                }
                            }
                        ]
                    },
                    {
                        path: 'cajas',
                        data: {
                            menu: {
                                title: 'Cajas',
                            }
                        }
                    }
                ]
            },
            {
                path: 'comprobantesFiscales',
                data: {
                    menu: {
                        title: 'general.menu.comprobantesfiscales',
                        icon: 'ion-stats-bars',
                        selected: false,
                        expanded: false,
                        order: 200,
                    }
                },

            },
            {
                path: 'nomina',
                data: {
                    menu: {
                        title: 'general.menu.nomina',
                        icon: 'ion-android-laptop',
                        selected: false,
                        expanded: false,
                        order: 300,
                    }
                },
                children: [
                    {
                        path: 'trabajadores',
                        data: {
                            menu: {
                                title: 'Trabajadores',

                            }
                        }
                    },
                    {
                        path: 'cfdi',
                        data: {
                            menu: {
                                title: 'Generar y Consultar CFDI',
                            }
                        }
                    },
                    {
                        path: 'percepciones',
                        data: {
                            menu: {
                                title: 'Percepciones',
                            }
                        }
                    },
                    {
                        path: 'deducciones',
                        data: {
                            menu: {
                                title: 'Deducciones',
                            }
                        }
                    },
                ]
            },
            {
                path: 'listaIngresos',
                data: {
                    menu: {
                        title: 'general.menu.ingresos',
                        icon: 'ion-compose',
                        selected: false,
                        expanded: false,
                        order: 400,
                    }
                },
            },
            {
                path: 'listaEgresos',
                data: {
                    menu: {
                        title: 'general.menu.egresos',
                        icon: 'ion-grid',
                        selected: false,
                        expanded: false,
                        order: 500,
                    }
                },
            },
            {
                path: 'reportes',
                data: {
                    menu: {
                        title: 'general.menu.reportes',
                        icon: 'ion-ios-location-outline',
                        selected: false,
                        expanded: false,
                        order: 600,
                    }
                },

            }
        ]
    }
];
