const Machine = require('../models/Machine')
const Incident = require('../models/Incident')


exports.cretepanne = async (req, res) =>{
    try {
        const { machine  , description , severity , status , resolutionNote , resolvedAt } = req.body;

          if(!machine  || !severity || !description) return res.status(400).json({message:"err"});

         const panne = await Incident.create({machine ,declaredBy:req.user._id, description ,severity:severity , status , resolutionNote , resolvedAt})

              const machineUp = await Machine.findById(machine);
              if(!machineUp) return res.status(400).json({message:"cant finde the machine"});

              machineUp.status = "maintenance";
              await machineUp.save();


         res.status(201).json(panne)
    }catch (e) {
        res.status(400).json({err:e})
    }
}