'use strict'

const task = require('../models/task.model');

var controller = {
	getTasks: function(req, res) {
		var userId = req.params.user_id;
		
		if(userId == null) return res.status(404).send({
			message: 'El id del usuario no es válido.'
		});
		
		task.find({creator: userId}).exec((err, tasks) => {
			if(err) return res.status(500).send({
				message: 'Error al obtener los datos.'
			});

			if(!tasks) return res.status(404).send({
				message: 'No existen tareas para mostrar.'
			});

			return res.status(200).send({
				tasks
			});
		});
	},

	getTask: function(req, res) {

		var taskId = req.params.id;
		
		if(taskId == null) return res.status(404).send({
			message: 'El id de la tarea no es válido.'
		});

		task.findById(taskId, (err, task) => {
			if(err) return res.status(500).send({
				message: 'Error al obtener los datos.'
			});

			if(!task) return res.status(404).send({
				message: 'La tarea no existe.'
			});

			return res.status(200).send({
				task
			});
		});	
	},

	addTask: function(req, res) {
		var new_task = new task();

		var params = req.body;

		// Validar que los datos lleguen
		var valid = true;

		if(params.text != null) new_task.text = params.text; else valid &= false;
		if(params.creator != null) new_task.creator = params.creator; else valid &= false;
		new_task.incharge = params.incharge == null ? '' : params.incharge;
		new_task.category = params.category == null ? '' : params.category;
		new_task.status = params.status == null ? '' : params.status;
		new_task.created_at = new Date();


		if(valid){
			// Guardar tarea
			new_task.save((err, taskAdded) => {
				if(err) return res.status(500).send({
					message: 'Hubo un error al guardar la tarea.',
					info: err.errors
				});

				if(!taskAdded) return res.status(404).send({
					message: 'No se ha podido guardar la tarea.'
				});

				return res.status(200).send({
					user: taskAdded
				});
			});
		}else{
			return res.status(400).send({
				message: 'Los datos de la tarea estan incompletos.',
				data_required: {
					text: 'required',
					incharge: 'no required',
					creator: 'require',
					category: 'no required',
					status: 'no required'
				}
			});
		}
	},

	updateTask: function(req, res){
		var taskId = req.params.id;
        var update = req.body;

        task.findByIdAndUpdate(taskId, update, {new:true}, (err, taskUpdated) => {
            if (err) return res.status(500).send({
            	message: 'Hubo un error al querer actualizar la tarea.'
            });

            if (!taskUpdated) return res.status(404).send({
            	message: 'No existe la tarea para actualizar.'
            });

            return res.status(200).send({
                task: taskUpdated
            });
        });
	},

	deleteTask: function(req, res){
		var taskId = req.params.id;

        task.findByIdAndDelete(taskId, (err, taskDeleted) => {
            if (err) return res.status(500).send({
            	message: 'Hubo un error al querer borrar el usuariola tarea.'
            });

            if (!taskDeleted) return res.status(404).send({
            	message: 'No se puede eliminar esta tarea.'
            });

            return res.status(200).send({
                task: taskDeleted
            });
        });
	}
}

module.exports = controller;
