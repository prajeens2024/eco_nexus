import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPrediction extends Document {
    resourceType: 'machine' | 'labor' | 'warehouse' | 'scrap';
    region: string;
    predictedDemand: number;
    predictedIdlePeriod: {
        start: Date;
        end: Date;
    };
    confidence: number;
    factors: {
        name: string;
        weight: number;
        value: number;
    }[];
    suggestion: string;
    generatedAt: Date;
}

const predictionSchema = new Schema<IPrediction>(
    {
        resourceType: { type: String, enum: ['machine', 'labor', 'warehouse', 'scrap'], required: true },
        region: { type: String, required: true },
        predictedDemand: { type: Number, required: true },
        predictedIdlePeriod: {
            start: { type: Date },
            end: { type: Date },
        },
        confidence: { type: Number, required: true, min: 0, max: 1 },
        factors: [
            {
                name: { type: String },
                weight: { type: Number },
                value: { type: Number },
            },
        ],
        suggestion: { type: String },
        generatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

predictionSchema.index({ resourceType: 1 });
predictionSchema.index({ region: 1 });
predictionSchema.index({ generatedAt: -1 });

const Prediction: Model<IPrediction> = mongoose.model<IPrediction>('Prediction', predictionSchema);
export default Prediction;
