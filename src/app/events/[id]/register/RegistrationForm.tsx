"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StrideXEvent, EventCategory } from '../../../data/events';
import { calculateTotalFee, PaymentMethod, GATEWAY_FEES } from '../../../utils/fees';
import styles from './RegistrationForm.module.css';

interface RegistrationFormProps {
  event: StrideXEvent;
}

type Step = 1 | 2 | 3 | 4;

export default function RegistrationForm({ event }: RegistrationFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(null);
  
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    nationality: '',
    dateOfBirth: '',

    // Address
    address: '',
    city: '',
    country: 'Philippines',
    zipCode: '',

    // Race Items
    shirtSize: 'M',
    finisherShirtSize: 'M',

    // Emergency Contact
    emergencyContactName: '',
    emergencyContactPhone: '',

    // Legal
    medicalWaiver: false
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('GCASH');

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 4) as Step);
  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1) as Step);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const currentTime = new Date().getTime();
  const earlyBirdDeadlineTime = event.early_bird_deadline ? new Date(event.early_bird_deadline).getTime() : 0;
  const isEarlyBirdActive = currentTime < earlyBirdDeadlineTime;

  const currentPrice = selectedCategory 
    ? (isEarlyBirdActive && selectedCategory.early_bird_price ? selectedCategory.early_bird_price : selectedCategory.base_price)
    : 0;

  const currentFees = selectedCategory 
    ? calculateTotalFee(currentPrice, paymentMethod) 
    : null;

  const handleCheckout = async () => {
    if (!selectedCategory || !currentFees || !formData.medicalWaiver) return;

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          categoryId: selectedCategory.id,
          paymentMethod,
          runnerInfo: formData
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Checkout failed');
      }

      const { checkoutUrl } = await response.json();
      router.push(checkoutUrl);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to initialize checkout.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const step2Valid = formData.firstName && formData.lastName && formData.email && formData.gender && formData.dateOfBirth;
  const step3Valid = formData.address && formData.city && formData.country && formData.emergencyContactName && formData.emergencyContactPhone;

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];

  return (
    <div className={styles.formWrapper}>
      {/* Stepper Header */}
      <div className={styles.stepper}>
        <div className={`${styles.stepIndicator} ${step >= 1 ? styles.active : ''}`}>1. Category</div>
        <div className={styles.stepLine}></div>
        <div className={`${styles.stepIndicator} ${step >= 2 ? styles.active : ''}`}>2. Runner Info</div>
        <div className={styles.stepLine}></div>
        <div className={`${styles.stepIndicator} ${step >= 3 ? styles.active : ''}`}>3. Address</div>
        <div className={styles.stepLine}></div>
        <div className={`${styles.stepIndicator} ${step >= 4 ? styles.active : ''}`}>4. Checkout</div>
      </div>

      <div className={styles.layout}>
        <div className={styles.mainContent}>

          {/* STEP 1: Category Selection */}
          {step === 1 && (
            <div className={`${styles.stepContent} animate-fade-in-up`}>
              <h2>Select Category</h2>
              <div className={styles.categoryGrid}>
                {event.categories.map(cat => (
                  <div 
                    key={cat.id}
                    className={`${styles.categoryCard} ${selectedCategory?.id === cat.id ? styles.selected : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    <h3>{cat.name}</h3>
                    <p className={styles.distance}>{cat.distance}</p>
                    <p className={styles.price}>PHP {cat.base_price.toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className={styles.actions}>
                <button className="btn-primary" onClick={handleNext} disabled={!selectedCategory}>
                  Continue to Runner Info
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Runner Personal Info */}
          {step === 2 && (
            <div className={`${styles.stepContent} animate-fade-in-up`}>
              <h2>Runner Information</h2>
              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label>First Name</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                </div>
                <div className={styles.inputGroup}>
                  <label>Last Name</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                </div>
                <div className={styles.inputGroup}>
                  <label>Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                </div>
                <div className={styles.inputGroup}>
                  <label>Date of Birth</label>
                  <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} required />
                </div>
                <div className={styles.inputGroup}>
                  <label>Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleInputChange} required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-Binary">Non-Binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
                <div className={styles.inputGroup}>
                  <label>Nationality</label>
                  <input type="text" name="nationality" value={formData.nationality} onChange={handleInputChange} placeholder="e.g. Filipino" />
                </div>
                <div className={styles.inputGroup}>
                  <label>Singlet Size</label>
                  <select name="shirtSize" value={formData.shirtSize} onChange={handleInputChange}>
                    {sizeOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className={styles.inputGroup}>
                  <label>Finisher Shirt Size</label>
                  <select name="finisherShirtSize" value={formData.finisherShirtSize} onChange={handleInputChange}>
                    {sizeOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className={styles.actions}>
                <button className="btn-secondary" onClick={handlePrev}>Back</button>
                <button className="btn-primary" onClick={handleNext} disabled={!step2Valid}>
                  Continue to Address
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Address & Emergency Contact */}
          {step === 3 && (
            <div className={`${styles.stepContent} animate-fade-in-up`}>
              <h2>Address & Emergency Contact</h2>
              <div className={styles.formGrid}>
                <div className={styles.inputGroup} style={{ gridColumn: 'span 2' }}>
                  <label>Street Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleInputChange} required />
                </div>
                <div className={styles.inputGroup}>
                  <label>City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleInputChange} required />
                </div>
                <div className={styles.inputGroup}>
                  <label>Country</label>
                  <input type="text" name="country" value={formData.country} onChange={handleInputChange} required />
                </div>
                <div className={styles.inputGroup}>
                  <label>Zip Code</label>
                  <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} />
                </div>
              </div>

              <h2 style={{ marginTop: '2rem' }}>Emergency Contact</h2>
              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label>Contact Name</label>
                  <input type="text" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleInputChange} required />
                </div>
                <div className={styles.inputGroup}>
                  <label>Contact Phone</label>
                  <input type="text" name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={handleInputChange} required />
                </div>
              </div>

              <div className={styles.actions}>
                <button className="btn-secondary" onClick={handlePrev}>Back</button>
                <button className="btn-primary" onClick={handleNext} disabled={!step3Valid}>
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Checkout & Payment */}
          {step === 4 && (
            <div className={`${styles.stepContent} animate-fade-in-up`}>
              <h2>Checkout</h2>
              
              <div className={styles.medicalWaiver}>
                <h3>Medical Waiver & Terms</h3>
                <p>I attest that I am physically fit to participate in this event and understand the inherent risks associated with endurance sports.</p>
                <label className={styles.checkboxLabel}>
                  <input 
                    type="checkbox" 
                    name="medicalWaiver" 
                    checked={formData.medicalWaiver} 
                    onChange={handleInputChange} 
                  />
                  I agree to the Medical Waiver and Terms of Service
                </label>
              </div>

              <div className={styles.paymentMethods}>
                <h3>Select Payment Method</h3>
                <div className={styles.paymentGrid}>
                  {(Object.keys(GATEWAY_FEES) as PaymentMethod[]).map((method) => (
                    <div 
                      key={method}
                      className={`${styles.paymentCard} ${paymentMethod === method ? styles.selected : ''}`}
                      onClick={() => setPaymentMethod(method)}
                    >
                      {GATEWAY_FEES[method].label}
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.actions}>
                <button className="btn-secondary" onClick={handlePrev} disabled={isSubmitting}>Back</button>
                <button 
                  className="btn-primary" 
                  disabled={!formData.medicalWaiver || isSubmitting}
                  onClick={handleCheckout}
                >
                  {isSubmitting ? 'Processing...' : `Pay PHP ${currentFees?.total.toLocaleString()}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Summary */}
        <div className={styles.sidebar}>
          <div className={styles.summaryCard}>
            <h3>Registration Summary</h3>
            {selectedCategory ? (
              <>
                <div className={styles.summaryItem}>
                  <span>Category</span>
                  <strong>{selectedCategory.name}</strong>
                </div>
                <div className={styles.summaryItem}>
                  <span>Distance</span>
                  <strong>{selectedCategory.distance}</strong>
                </div>
                {formData.shirtSize && (
                  <div className={styles.summaryItem}>
                    <span>Singlet Size</span>
                    <strong>{formData.shirtSize}</strong>
                  </div>
                )}
                {formData.finisherShirtSize && (
                  <div className={styles.summaryItem}>
                    <span>Finisher Shirt</span>
                    <strong>{formData.finisherShirtSize}</strong>
                  </div>
                )}
                <div className={styles.summaryItem}>
                  <span>Base Price</span>
                  <span>PHP {currentFees?.basePrice.toLocaleString()}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span>Platform Fee</span>
                  <span>PHP {currentFees?.platformFee.toLocaleString()}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span>Processing Fee ({GATEWAY_FEES[paymentMethod].label})</span>
                  <span>PHP {currentFees?.gatewayFee.toLocaleString()}</span>
                </div>
                <hr className={styles.divider} />
                <div className={styles.summaryTotal}>
                  <span>Total Amount</span>
                  <span>PHP {currentFees?.total.toLocaleString()}</span>
                </div>
              </>
            ) : (
              <p className={styles.emptySummary}>Please select a category to view the summary.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
