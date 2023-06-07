import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema({
    messages: [
        {
        role: String,
        content: String,
        },
    ],
});

export default mongoose.model('Conversation', ConversationSchema);
