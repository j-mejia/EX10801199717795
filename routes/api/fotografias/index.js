var express= require('express');
var router = express.Router();

var fileModel = require('../filemodel');

var fotCollection = fileModel.getFotografias();

router.get('/', function(req, res){
  res.json({
    "entity":"Fotografias",
    "version":"0.0.1"
  });
}); //get

router.get('/all', function(req, res){
  fotCollection = fileModel.getFotografias();
  res.json(fotCollection);
}) //GET /ALL




router.post('/new', function(req, res){
  fotCollection = fileModel.getFotografias();
  var newCo = Object.assign(
     {},
     req.body,
     {
         "title": req.body.title,
         "url": req.body.url,
         "thumbnailUrl": req.body.thumbnailUrl,
         "album": req.body.album

     }
  );
  var coExists = fotCollection.find(
    function(o, i){
      return o.codigo === newCo.codigo;
    }
  )
  if( ! coExists ){
    fotCollection.push(newCo);
    fileModel.setFotografias(
       fotCollection,
       function(err, savedSuccesfully){
         if(err){
           res.status(400).json({ "error": "No se pudo ingresar objeto" });
         } else {
           res.json(newCo);  // req.body ===  $_POST[]
         }
       }
     );
  } else {
    res.status(400).json({"error":"No se pudo ingresar objeto"});
  }
}); // post /new


router.put('/update/:fotCodigo',
  function(req, res){
      fotCollection = fileModel.getFotografias();
      var fotCodigoToModify = req.params.fotCodigo;
      var amountToAdjust = parseInt(req.body.ajustar);
      var adjustType = req.body.tipo || 'SUB';
      var adjustType2 = req.body.tipo1 || 'SUB';
      var adjustHow = (adjustType == 'ADD' ? 1 : -1);
      var adjustHow = (adjustType2 == 'ADD' ? 1 : -1);
      var modFotografias = {};
      var newFotografiasArray = fotCollection.map(
        function(o,i){
          if( fotCodigoToModify === o.codigo){
             o.url = adjustType;
             o.thumbnailUrl = adjustType2;
             modFotografias = Object.assign({}, o);
          }
          return o;
        }
      ); // end map
    fotCollection = newFotografiasArray;
    fileModel.setFotografias(
      fotCollection,
      function (err, savedSuccesfully) {
        if (err) {
          res.status(400).json({ "error": "No se pudo actualizar objeto" });
        } else {
          res.json(modFotografias);  // req.body ===  $_POST[]
        }
      }
    );
  }
);// put :prdsku


router.delete(
  '/delete/:fotCodigo',
  function( req, res) {
    fotCollection = fileModel.getFotografias();
    var fotCodigoToDelete  = req.params.fotCodigo;
    var newFotCollection = fotCollection.filter(
      function(o, i){
        return fotCodigoToDelete !== o.codigo;
      }
    ); //filter
    fotCollection = newFotCollection;
    fileModel.setFotografias(
      fotCollection,
      function (err, savedSuccesfully) {
        if (err) {
          res.status(400).json({ "error": "No se pudo eliminar objeto" });
        } else {
          res.json({"newProdsQty": fotCollection.length});
        }
      }
    );
  }
);// delete


module.exports = router;
