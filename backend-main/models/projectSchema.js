import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  projectDesc: { type: String, required: true },
  members: [{ type: Object }],
});

const project = mongoose.model('project', projectSchema);

export default project;
