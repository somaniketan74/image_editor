(
    function () {
        var myApp = angular.module('myApp', ['cfp.hotkeys']).directive('fileChange', function() {
            return {
                restrict: 'A',
                scope: {
                    handler: '&'
                },
                link: function (scope, element) {
                    element.on('change', function (event) {
                        scope.$apply(function(){
                            scope.handler({files: event.target.files});
                        });
                    });
                }
            };
        });
        myApp.controller('AppCtrl', ['$scope', '$http','hotkeys', function ($scope, $http,hotkeys) {
            var canvas=new fabric.Canvas('canvas');
            $scope.data={};
            $scope.data.objectAvailable=false;
            $scope.scaleProperty={
                width:0,
                height:0
            };
            hotkeys.add({
                combo: 'ctrl+z',
                description: 'Undo action',
                callback: function() {
                    updateAction(undo, redo);
                }
            });
            hotkeys.add({
                combo: 'ctrl+shift+z',
                description: 'Redo action',
                callback: function() {
                    updateAction(redo, undo);
                }
            });
            save();
            canvas.on('object:modified', function() {
                save();
            });
            $scope.images=[];
            //Maintain state,undo,redo
            var state;
            var undo = [];
            var redo = [];

            function save () {
                redo = [];
                if (state) {
                    undo.push(state);
                }
                state = JSON.stringify(canvas);
            };

            function updateAction(newlist, oldlist) {
                oldlist.push(state);
                state = newlist.pop();
                canvas.clear();
                canvas.loadFromJSON(state, function() {
                    canvas.renderAll();
                });
            }

            $scope.imageUpload =function (files) {
                if($scope.data.objectAvailable){
                    $(":file").filestyle('clear');
                    alert('Canvas contain already image.Please clear canvas');
                    return;
                }
                $scope.data.objectAvailable=true;
                var file=files[0];
                var reader = new FileReader();
                reader.onload = function (f) {
                    var data = f.target.result;
                    fabric.Image.fromURL(data, function (img) {
                        canvas.add(img);
                        canvas.centerObject(img);
                        var Img=canvas.item(0);
                        Img.set({
                            selectable: true
                        });
                        canvas.add(Img);
                        canvas.renderAll();
                        save();
                    });
                };
                $(":file").filestyle('clear');
                reader.readAsDataURL(file);
            };
            $scope.rotateImage = function(){
                var Img=canvas.item(0);
                var objectOrigin = new fabric.Point(Img.left, Img.top);
                var canvasCenter = new fabric.Point(250, 250); // center of canvas
                var rads = 0.174532925;
                var new_loc = fabric.util.rotatePoint(objectOrigin, canvasCenter, rads);

                var angle_img=Img.getAngle()+10;
                Img.set({
                    top:new_loc.y,
                    left:new_loc.x,
                    angle:angle_img
                });
                canvas.renderAll();
                save();
            };
            $scope.calculateX = function () {
                var Img=canvas.item(0);
                var width=Img.width;
                var height=Img.height;
                console.log("Width::"+width);
                console.log("Height::"+height);
                var aspectRation=width/height;
                $scope.scaleProperty.width=$scope.scaleProperty.height*aspectRation;
            };
            $scope.calculateY = function () {
                var Img=canvas.item(0);
                var width=Img.width;
                var height=Img.height;
                console.log("Width::"+width);
                console.log("Height::"+height);
                var aspectRation=height/width;
                $scope.scaleProperty.height=$scope.scaleProperty.width*aspectRation;
            };
            $scope.scaleImage =function(){
                var Img=canvas.item(0);
                var scaleX=$scope.scaleProperty.width/Img.width;
                var scaleY=$scope.scaleProperty.height/Img.height;
                console.log("scaleX::"+scaleX);
                console.log("scaleY::"+scaleY);
                Img.set({
                    scaleX: scaleX,
                    scaleY: scaleY,
                    originX: 'center',
                    originY: 'center'
                });
                canvas.renderAll();
                save();
            };

            $scope.download = function () {
                var myEl = angular.element(document.querySelector('#download'));
                myEl.attr('href',canvas.toDataURL('png'));
                myEl.attr('download','download.png');
            }
            $scope.saveImage = function () {
                canvas.remove(canvas.item(1));
                var imageData=JSON.stringify(canvas);
                if(imageData.objects && imageData.objects.length==2){
                    imageData.objects.splice(1,1);
                }
                console.log(imageData);
                $http.post('/image', {'image':imageData}, undefined)
                    .success(function (data, status, headers, config) {
                        alert('Save successfully');
                        canvas.clear();
                        $scope.getImageList();
                        $scope.data.objectAvailable=false;
                    })
                    .error(function (data, status, header, config) {
                        alert('Error from server');
                    });
            }
            $scope.getImageList = function () {
                var fields="id,created";
                $http.get('/image?fields='+fields, undefined)
                    .success(function (data, status, headers, config) {
                        $scope.images=data;
                    })
                    .error(function (data, status, header, config) {
                        alert('Error from server');
                    });
            }
            $scope.getImageData = function (id) {
                if($scope.data.objectAvailable){
                    alert('Canvas contain already image.Please clear canvas');
                    return;
                }
                $http.get('/image/'+id, undefined)
                    .success(function (data, status, headers, config) {
                        if(data && data.length && data[0].image){
                            var canvas_data=data[0].image;
                            canvas.clear();
                            canvas.loadFromJSON(canvas_data, function() {
                                canvas.renderAll();
                            });
                            $scope.data.objectAvailable=true;
                        }
                    })
                    .error(function (data, status, header, config) {
                        alert('Error from server');
                    });
            }
            $scope.deleteImageData = function (id) {
                $http.delete('/image/'+id, undefined)
                    .success(function (data, status, headers, config) {
                        $scope.getImageList();
                    })
                    .error(function (data, status, header, config) {
                        alert('Error from server');
                    });
            }
            $scope.getImageList();
            $scope.reset=function () {
                canvas.clear();
                canvas.renderAll();
                $scope.data.objectAvailable=false;
                state=undefined;
                undo = [];
                redo = [];
                save();
            }
        }]);
    }
)();