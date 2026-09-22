import QrCode from "../../assets/QrCode.png";

export default function PaymentModal({
  total,
  lessons,
  onClose,
  onSuccess,
}) {
  return (
    <div className="payment-overlay" onClick={onClose}>
      <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="payment-icon">💳</div>
        <h2>Оплата занятий</h2>
        <p>Проверьте информацию перед оплатой</p>
        <div className="payment-info">
          <div className="payment-row">
            <span>Количество занятий</span>
            <strong>{lessons}</strong>
          </div>
          <div className="payment-row">
            <span>Стоимость</span>
            <strong>{total.toLocaleString()} ₽</strong>
          </div>
        </div>
        <div className="payment-qr">
         <img
                src={QrCode}
                alt="Оплата"
                className="payment-image"
            />
        </div>
        <p className="payment-text">
          Отсканируйте QR-код через
          приложение вашего банка
          или мобильный телефон.
        </p>
        <div className="payment-buttons">
          <button className="cancel-payment" onClick={onClose}>Отмена</button>
          <button className="success-payment" onClick={onSuccess}>✔ Я оплатил</button>
        </div>
      </div>
    </div>
  );
}