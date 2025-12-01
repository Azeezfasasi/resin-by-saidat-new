import mongoose from 'mongoose';

const trainingRegistrationSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    occupation: {
      type: String,
      trim: true,
    },
    sessionDate: {
      type: String,
      enum: ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'],
      required: true,
    },
    referralSource: {
      type: String,
      trim: true,
    },
    agreeTerms: {
      type: Boolean,
      required: true,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'paid', 'completed', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'partial', 'paid'],
      default: 'unpaid',
    },
    paymentAmount: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      trim: true,
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    confirmationSentAt: {
      type: Date,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Indexes for queries
trainingRegistrationSchema.index({ sessionDate: 1, status: 1 });

export default mongoose.models.TrainingRegistration ||
  mongoose.model('TrainingRegistration', trainingRegistrationSchema);
