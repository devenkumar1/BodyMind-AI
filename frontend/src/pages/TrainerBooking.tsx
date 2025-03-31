import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Calendar from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Calendar as CalendarIcon, Clock, User, CheckCircle2, ChevronRight, Star } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label as UILabel } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

interface TimeSlot {
  time: string;
  available: boolean;
}

const timeSlots: TimeSlot[] = [
  { time: '09:00 AM', available: true },
  { time: '10:00 AM', available: true },
  { time: '11:00 AM', available: true },
  { time: '12:00 PM', available: true },
  { time: '02:00 PM', available: true },
  { time: '03:00 PM', available: true },
  { time: '04:00 PM', available: true },
  { time: '05:00 PM', available: true },
];

const trainers = [
  { id: 1, name: 'John Smith', specialization: 'Strength Training', rating: 4.8 },
  { id: 2, name: 'Sarah Johnson', specialization: 'Yoga & Flexibility', rating: 4.9 },
  { id: 3, name: 'Mike Wilson', specialization: 'Cardio & HIIT', rating: 4.7 },
];

function TrainerBooking() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedTrainer, setSelectedTrainer] = useState<number | null>(null);
  const [bookingStep, setBookingStep] = useState<'date' | 'time' | 'trainer' | 'confirm'>('date');

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setBookingStep('time');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setBookingStep('trainer');
  };

  const handleTrainerSelect = (trainerId: number) => {
    setSelectedTrainer(trainerId);
    setBookingStep('confirm');
  };

  const handleConfirmBooking = () => {
    // Here you would typically make an API call to save the booking
    toast.success('Booking confirmed successfully!');
    // Reset the form
    setDate(undefined);
    setSelectedTime('');
    setSelectedTrainer(null);
    setBookingStep('date');
  };

  const selectedTrainerInfo = trainers.find(trainer => trainer.id === selectedTrainer);

  const handleBack = () => {
    if (bookingStep === 'date') return;
    setBookingStep(prevStep => prevStep === 'date' ? 'date' : prevStep as 'date');
  };

  const handleNext = () => {
    if (bookingStep === 'confirm') {
      handleConfirmBooking();
    } else {
      setBookingStep(prevStep => prevStep === 'date' ? 'time' : prevStep === 'time' ? 'trainer' : 'confirm');
    }
  };

  return (
    <div className="container max-w-4xl py-12 mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center mb-12"
      >
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/50 rounded-lg blur opacity-25"></div>
          <h1 className="relative text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50 mb-3">
            Book a Training Session
          </h1>
        </div>
        <p className="text-muted-foreground text-center max-w-2xl">
          Schedule your personalized training session with our expert trainers
        </p>
      </motion.div>

      <div className="space-y-8">
        {/* Progress Steps */}
        <div className="flex justify-center items-center space-x-4 mb-8">
          {['date', 'time', 'trainer', 'confirm'].map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                bookingStep === step ? "bg-primary text-white" : "bg-muted text-muted-foreground"
              )}>
                {index + 1}
              </div>
              {index < 3 && (
                <div className={cn(
                  "w-16 h-1 mx-2",
                  bookingStep === step ? "bg-primary" : "bg-muted"
                )} />
              )}
            </div>
          ))}
        </div>

        {/* Booking Steps */}
        <Card className="border-2 hover:border-primary/50 transition-colors duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              {bookingStep === 'date' && <CalendarIcon className="w-6 h-6 text-primary" />}
              {bookingStep === 'time' && <Clock className="w-6 h-6 text-primary" />}
              {bookingStep === 'trainer' && <User className="w-6 h-6 text-primary" />}
              {bookingStep === 'confirm' && <CheckCircle2 className="w-6 h-6 text-primary" />}
              {bookingStep === 'date' && 'Select Date'}
              {bookingStep === 'time' && 'Select Time'}
              {bookingStep === 'trainer' && 'Choose Trainer'}
              {bookingStep === 'confirm' && 'Confirm Booking'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {bookingStep === 'date' && (
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  className="rounded-md border"
                />
              </div>
            )}

            {bookingStep === 'time' && (
              <div className="space-y-4">
                <UILabel>Select Time Slot</UILabel>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot.time}
                      variant={selectedTime === slot.time ? "default" : "outline"}
                      className="w-full"
                      disabled={!slot.available}
                      onClick={() => setSelectedTime(slot.time)}
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      {slot.time}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {bookingStep === 'trainer' && (
              <div className="space-y-4">
                <UILabel>Select Your Trainer</UILabel>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trainers.map((trainer) => (
                    <Card
                      key={trainer.id}
                      className={`cursor-pointer transition-all ${
                        selectedTrainer === trainer.id
                          ? "border-primary shadow-lg scale-105"
                          : "hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedTrainer(trainer.id)}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <User className="w-5 h-5" />
                          {trainer.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">{trainer.specialization}</p>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{trainer.rating}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {bookingStep === 'confirm' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-semibold">Booking Summary</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-medium">{date && format(date, 'PPP')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Time</p>
                        <p className="font-medium">{selectedTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Trainer</p>
                        <p className="font-medium">
                          {selectedTrainerInfo?.name}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={handleConfirmBooking}
                  className="w-full"
                >
                  Confirm Booking
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Update the navigation buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={bookingStep === 'date'}
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={
              (bookingStep === 'date' && !date) ||
              (bookingStep === 'time' && !selectedTime) ||
              (bookingStep === 'trainer' && !selectedTrainer)
            }
          >
            {bookingStep === 'trainer' ? 'Confirm Booking' : 'Next'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TrainerBooking; 