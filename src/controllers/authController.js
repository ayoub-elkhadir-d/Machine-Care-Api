const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.createDefaultUser = async () => {
  try {
    const email = process.env.DEFAULT_USER_EMAIL || 'admin@safi.ma';
    const password = process.env.DEFAULT_USER_PASSWORD || '123456';

    const user = await User.findOne({ email });
    if (!user) {
      await User.create({ email, password });
      console.log('Compte par défaut créé !');
    } else {
      console.log('Compte par défaut existe déjà !');
    }
  } catch (err) {
    console.error('Erreur lors de la création du compte par défaut:', err.message);
  }
};

exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ message: 'Email et mot de passe obligatoires' });
		}

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({ message: 'Identifiants invalides' });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(401).json({ message: 'Identifiants invalides' });
		}

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

		res.json({ token, userId: user._id });
	} catch (err) {
		res.status(500).json({ message: 'Erreur serveur' });
	}
};

exports.register = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ message: 'Email et mot de passe obligatoires' });
		}

		const userExists = await User.findOne({ email });
		if (userExists) {
			return res.status(400).json({ message: 'Email déjà utilisé' });
		}

		const user = await User.create({ email, password });
		res.status(201).json({ message: 'Utilisateur créé', userId: user._id });
	} catch (err) {
		res.status(500).json({ message: 'Erreur serveur' });
	}
};

exports.getProfile = async (req, res) => {
	res.json(req.user);
};

exports.updateProfile = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);

		if (req.body.email) user.email = req.body.email;
		if (req.body.password) user.password = req.body.password;

		await user.save();
		res.json({ message: 'Profil mis à jour', email: user.email });
	} catch (err) {
		res.status(500).json({ message: 'Erreur serveur' });
	}
};