// import mongoose from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// export const UserSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: true,
//     index: {
//       unique: true
//     },
//     validate: {
//       validator: function(v) {
//         return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
//       },
//       message: props => 'Please fill a valid email address'
//     }
//     // validate: [validateEmail, 'Please fill a valid email address'],
//   },
//   name: {
//     type: String,
//     required: true,
//   },
//   password: {
//     type: String,
//     required: true,
//     validate: {
//       validator: function(v) {
//         return /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v);
//       },
//       message: props => `Password must be at least 8 characters long, contain at least one letter, one number, and one special character!`
//     }
//   }
// });

// export const UserModel = mongoose.model('User', UserSchema);

// export type UserDocument = User & Document;

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    required: true,
    index: { unique: true },
    validate: {
      validator: function(v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: props => 'Please fill a valid email address'
    }
  })
  email: string;

  @Prop({ required: true, })
  name: string;

  @Prop({ required: true, })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
