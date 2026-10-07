const Machine = require('../models/Machine')
const Incident = require('../models/Incident');
//

exports.cretepanne = async (req, res) =>{
    try {
        const { machine  , description , severity , status , resolutionNote , resolvedAt } = req.body;

          if(!machine  || !severity || !description) return res.status(400).json({message:"err"});
 
         const machineUp = await Machine.findById(machine);
          if(!machineUp) return res.status(400).json({message:"Machine Not Found !!!"})
         const panne = await Incident.create({machine ,declaredBy:req.user._id, description ,severity:severity , status , resolutionNote , resolvedAt})

              machineUp.status = "maintenance";
              await machineUp.save();


         res.status(201).json(panne)
    }catch (e) {
        res.status(400).json({err:e})
    }
}
exports.updatePanne = async (req, res) => {
  try {
    const { status, resolutionNote, description, severity } = req.body;

    const panne = await Incident.findById(req.params.id);
    if (!panne) {
      return res.status(404).json({ message: "Panne introuvable !" });
    }

    if (status === "resolved") {
      if (!resolutionNote && !panne.resolutionNote) {
        return res.status(400).json({ 
          message: "Une note de résolution (resolutionNote) est obligatoire pour résoudre la panne !" 
        });
      }

      const machine = await Machine.findById(panne.machine);
      if (!machine) {
        return res.status(404).json({ message: "Machine liée à la panne introuvable !" });
      }

      machine.status = "operational";
      await machine.save();

      panne.resolutionNote = resolutionNote || panne.resolutionNote;
      panne.resolvedAt = Date.now();
    }

    if (status) panne.status = status;
    if (description) panne.description = description;
    if (severity) panne.severity = severity;

    await panne.save();

    res.status(200).json({
      message: "Panne mise à jour avec succès !",
      panne
    });

  } catch (e) {
    if (e.name === 'CastError') {
      return res.status(400).json({ message: "Format d'ID invalide !" });
    }
    res.status(500).json({
      message: "Erreur serveur lors de la mise à jour de la panne",
      error: e.message
    });
  }
};

exports.getPannes = async (req, res) => {
   try {
  const { status, machine } = req.query;
     const filter = {}
     const allowedStatus = ['open', 'in_progress', 'resolved']
     if (status) {
       if(!allowedStatus.includes(status.toLowerCase())) return res.status(400).json({message:"the status invalide!!!"})
        filter.status = status.toLowerCase()
     }
     if (machine) filter.machine = machine
        
     const pannes = await Incident.find(filter).populate('machine', 'name location status ').populate('declaredBy', 'email');
     res.status(200).json(pannes)
 // return res.status(401).json({message:"cannot get the pannes !!!"})


  } catch (e) {
    res.status(500).json({message:"cannot get the pannes !!!"})
  }
}


exports.getPanneById = async (req, res) => {
  try {
    
    const panne = await Incident.findById(req.params.id).populate('machine', 'name location status ').populate('declaredBy', 'email');
    if(!panne) return res.status(404).json({message:"cannot find the Panne !!!"})
    res.status(200).json(panne)
    
  } catch (e) {
    
    res.status(500).json({ 
          message: "Erreur serveur lors de la récupération de l'incident", 
          error: e.message 
        });

}
}