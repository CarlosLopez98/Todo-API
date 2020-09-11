'use strict'

const user = require('../models/user.model');
const bcrypt = require('bcryptjs');
const secret_key = 'H01AMUND0123abc';

var controller = {
	getUsers: function(req, res) {
		
		user.find().exec((err, users) => {
			if(err) return res.status(500).send({
				message: 'Error al obtener los datos.'
			});

			if(!users) return res.status(404).send({
				message: 'No existen usuarios para mostrar.'
			});

			return res.status(200).send({
				users
			});
		});
	},

	getUser: function(req, res) {
		var userId = req.params.id;

		if(userId == null) return res.status(404).send({
			message: 'El id del usuario no es válido.'
		});

		user.findById(userId, (err, user) => {
			if(err) return res.status(500).send({
				message: 'Error al obtener los datos.'
			});

			if(!user) return res.status(404).send({
				message: 'El usuario no existe'
			});

			return res.status(200).send({
				user
			});
		});		
	},

	addUser: function(req, res) {
		var new_user = new user();

		var params = req.body;

		// Validar que los datos lleguen
		var valid = true;

		if(params.name != null) new_user.name = params.name; else valid &= false;
		if(params.lastname != null) new_user.lastname = params.lastname; else valid &= false;
		if(params.nickname != null) new_user.nickname = params.nickname; else valid &= false;
		if(params.email != null) new_user.email = params.email; else valid &= false;
		if(params.password != null) new_user.password = params.password; else valid &= false;
		new_user.role = 'user';
		new_user.created_at = new Date();


		if(valid){
			new_user.password = hash_password(new_user.password);

			// Guardar usuario
			new_user.save((err, userAdded) => {
				if(err) return res.status(500).send({
					message: 'Hubo un error al guardar el usuario.',
					info: err.errors
				});

				if(!userAdded) return res.status(404).send({
					message: 'No se ha podido guardar el usuario.'
				});

				return res.status(200).send({
					user: userAdded
				});
			});
		}else{
			return res.status(400).send({
				message: 'Los datos del usuario estan incompletos.',
				data_required: {
					'name': 'required',
					'lastname': 'required',
					'nickname': 'required',
					'email': 'required',
					'password': 'required'
				}
			});
		}
	},

	updateUser: function(req, res){
		var userId = req.params.id;
        var update = req.body;

        if(update.password != null){
			update.password = hash_password(update.password);
        }

        user.findByIdAndUpdate(userId, update, {new:true}, (err, userUpdated) => {
            if (err) return res.status(500).send({
            	message: 'Hubo un error al querer actualizar el usuario.'
            });

            if (!userUpdated) return res.status(404).send({
            	message: 'No existe el usuario para actualizar.'
            });

            return res.status(200).send({
                user: userUpdated
            });
        });
	},

	deleteUser: function(req, res){
		var userId = req.params.id;

        user.findByIdAndDelete(userId, (err, userDeleted) => {
            if (err) return res.status(500).send({
            	message: 'Hubo un error al querer borrar el usuario.'
            });

            if (!userDeleted) return res.status(404).send({
            	message: 'No se puede eliminar este usuario.'
            });

            return res.status(200).send({
                user: userDeleted
            });
        });
	},

	authUser: function(req, res){
		var params = req.body;

		if(params.password == null) return res.status(400).send({
			message: 'Es imposible realizar la autenticación sin la contraseña.'
		});

		var auth_user = new user();

		if(params.nickname != null){
			// Auth con nickname
			user.findOne({nickname: params.nickname}, (err, userFound) => {
				if(err) return res.status(500).send({
					message: 'Hubo un error en la autenticación.'
				});

				if(!userFound) return res.status(404).send({
					message: 'No existe un usuario con este nickname.'
				});

				if(validate_password(params.password, userFound.password)){
					return res.status(200).send({
						user: userFound
					});
				}else{
					return res.status(404).send({
						message: 'La contraseña es incorrecta.'
					});
				}
			})
		}else if(params.email != null){
			// Auth con email
			user.findOne({email: params.email}, (err, userFound) => {
				if(err) return res.status(404).send({
					message: 'Hubo un error en la autenticación.'
				});

				if(!userFound) return res.status(404).send({
					message: 'No existe un usuario con este email.'
				});

				if(validate_password(params.password, userFound.password)){
					return res.status(200).send({
						user: userFound
					});
				}else{
					return res.status(404).send({
						message: 'La contraseña es incorrecta.'
					});
				}
			});
		}else{
			return res.status(400).send({
				message: 'Es imposible realizar la autenticación sin el email o nickname.'
			});
		}
	}
};

var hash_password = function(password){
	console.log('Hashing password...');
	var salt = bcrypt.genSaltSync(10);
	var hash = bcrypt.hashSync(password, salt);
	return hash;
}

var validate_password = function(password, hash){
	console.log('Validating password');

	return bcrypt.compareSync(password, hash);
}

module.exports = controller;
