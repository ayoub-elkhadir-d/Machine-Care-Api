const Machine = require('../models/Machine')
const Incident = require('../models/Incident');


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
exports.updatePanne = async  (req,res)=>{
    try {
        const panne = await Incident.findById(req.params.id);

        if(!panne) return res.status(401).json({message:"cannot find this panne !! "});

        panne.status = req.body.status;
        if(req.body.status === "resolved") {
            const machine =await Machine.findById(panne.machine);
            if(!machine) return res.status(401).json({message:"cannot find the machine !!!"})
            machine.status = "operational"
            await machine.save()
      }
        res.status(201).json({message:"panne updated !!!"})

    }catch (e) {
        res.status(500).json({message:"err , can't update the machine !!!"})
    }
}

exports.getPannes = async (req, res) => {
   try {
  const { status, machine } = req.query;
     const filter = {}
     if(status) filter.status = status
     if (machine) filter.machine = machine

     const pannes = await Incident.find(filter).populate('machine', 'name location status ').populate('declaredBy', 'email');
    res.status(200).json(pannes)
 // return res.status(401).json({message:"cannot get the pannes !!!"})


  } catch (e) {
    res.status(500).json({message:"cannot get the pannes !!!"})
  }
}
