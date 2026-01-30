import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const subscriptionSchema = new Schema({
  name : {
    type : String,
    required : [true, "Subscription name is required"],
    trim : true,
    minLength : 2,
    maxLength : 100
  },
  price : {
    type : Number,
    required : [true,"Subscription price is required"],
    min : [0,"Price should be greated than 0"],
  },
  frequency : {
    type : String,
    enum : ['daily','weekly','monthly','yearly'],
  },
  catagory : {
    type : String,
    enum : ['sports','news','entertainment','education','others'],
    required : true, 
  },
  paymentMethod : {
    type : String,
    required : true,
    trim : true,
  },
  status : {
    type : String,
    enum : ['active','cancled','expired'],
    default : 'active'
  },
  startDate : {
    type : DataTransfer,
    required : true,
    validate : {
      validator : (value) => value <= new Date(),
      message : 'Start date must be in past',
    }
  },
  renewalDate : {
    type : DataTransfer,
    validate : {
      validator : (value) => value > this.StartCate,
      message : 'renewal date must be after start date'
    }
  },
  users : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'user',
    required : true,
    index : true
  }
  } , {timestamp : true})

  subscriptionSchema.pre('save',(next) => {

    //Auto calculate the renewalDate if missing: 
    if(!renewalDate){
      const renewalPeriods = {
        daily : 1,
        weekly : 7,
        monthly : 30,
        yearly : 365,
      };

      this.renewalDate = new Date(this.startDate);
      this.renewalDate.set(this.renewalDate.getDate() + renewalPeriods[this.frequency]);

      //Auto update the status if renewal date is passed:
      if(this.renewalDate < new Date()){
        this.status = 'expired'
      }

      next();
    }
  })