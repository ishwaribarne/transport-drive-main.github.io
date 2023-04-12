/*
 * Contents of this file were modified by Anna Kurowska and/or others; last modified 2020-02-09
 */
if (window.tinymce) {
    (function () {
        tinymce.PluginManager.add('pbe_li_mce_btn', function (editor, url) {
            // function getValues() {
            // 	return editor.settings.cptPostsList;
            // }
            editor.addButton('pbe_li_mce_btn', {
                text: 'Add',
                icon: true,
                classes: 'pbe-li-btn ',
                tooltip: 'Add a Library Layout',
                onclick: function () {
                    editor.windowManager.open({
                        title: 'Insert Layout From Divi Library',
                        width: 600,
                        height: 110,
                        body: [
                            {
                                type: 'listbox',
                                classes: 'pbe-li-popup ',
                                name: 'libraryItemName',
                                /*label: 'Add From Library',*/
                                'values': ds_pbe_layouts,
                                onPostRender: function () {
                                    libraryItemName = this;
                                }
                            }
                        ],
                        onsubmit: function (e) {

                            // Setup the variables to simplify naming
                            var libraryItemID = e.data.libraryItemName;

                            // Setup the shortcode arguments
                            var args = {
                                tag: 'pbe_section',
                                type: 'single',
                                attrs: {
                                    global_module: libraryItemID
                                }
                            };

                            // This function filters the list of library items to return the selected item as an object
                            function getSelectedLibraryItem(value, array) {
                                var a = [];

                                a = array.filter(e => {
                                    return e.value === value;
                                });

                                return a;
                            }

                            // This calls the filter function and retrives the selected item
                            var selectedLibraryItemArray = getSelectedLibraryItem(libraryItemID, ds_pbe_layouts);

                            // This gets the library name from the selected item object
                            var selectedLibraryItemTitle = selectedLibraryItemArray[0].text;

                            // Modified this to utilise wp.shortcode.string() instead of outputting the shortcode as a string. This seems to remedy the autop bug I believe
                            editor.insertContent('<div contenteditable="false" class="pbe-li-sc" data-itemname="' + selectedLibraryItemTitle + '">' + wp.shortcode.string(args) + '</div>');

                        }
                    });
                }
            });
        });

        tinymce._ds_pbe_init = tinymce.init;
        tinymce.init = function (arg1) {
            if (!window.tinyMCEPreInit) {
                if (arg1.content_css) {
                    arg1.content_css += ',' + ds_pbe_fb_config.editorCssUrl;
                } else {
                    arg1.content_css = ds_pbe_fb_config.editorCssUrl;
                }
                if (arg1.toolbar) {
                    arg1.plugins += ' pbe_li_mce_btn';
                    arg1.toolbar += ',pbe_li_mce_btn';
                }
            }

            var oldSetup = arg1.setup;
            arg1.setup = function (setupArg1) {
                setupArg1.on('click', function (ev) {
                    var shortcode = ev.target.innerHTML.trim().toLowerCase();
                    if (shortcode.length > 14) {
                        var shortcodeParts = shortcode.substr(1, shortcode.length - 2).split(' ');
                        if (shortcodeParts[0].trim() == 'pbe_section') {
                            for (var i = 1; i < shortcodeParts.length; ++i) {
                                if (shortcodeParts[i].trim().substr(0, 13) == 'global_module') {
                                    var equalsPos = shortcodeParts[i].indexOf('=');
                                    if (equalsPos != -1) {
                                        var value = shortcodeParts[i].substr(equalsPos + 1).trim();
                                        if ((value[0] == '"' || value[0] == '\'') && value[0] == value[value.length - 1]) {
                                            value = value.substr(1, value.length - 2);
                                        }
                                        window.open((window.ds_pbe_fb_config ? ds_pbe_fb_config.editLayoutUrl : '?action=edit&post=') + value);
                                    }
                                }
                            }
                        }
                    }
                });
                if (oldSetup) {
                    return oldSetup(setupArg1);
                }
            }

            return tinymce._ds_pbe_init(arg1);
        }

    })();
}

