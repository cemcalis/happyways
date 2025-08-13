const transporter = {
  sendMail: async (mailOptions) => {
    console.log('\n EMAIL GÖNDERİLDİ:');
    console.log(' To:', mailOptions.to);
    console.log(' Subject:', mailOptions.subject);
    console.log(' HTML Content Preview:');
    console.log(mailOptions.html.substring(0, 200) + '...');
    console.log(' Email başarıyla gönderildi ');
    return { success: true };
  }
};

export async function sendReservationEmail(userEmail, reservationData) {
  const mailOptions = {
    from: 'happyways.rental@gmail.com',
    to: userEmail,
    subject: 'HappyWays - Rezervasyon Onayı',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2196F3;"> Rezervasyonunuz Onaylandı!</h2>

        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Rezervasyon Detayları</h3>
          <p><strong>Rezervasyon ID:</strong> ${reservationData.reservation_id}</p>
          <p><strong>Araç:</strong> ${reservationData.carModel}</p>
          <p><strong>Alış Tarihi:</strong> ${reservationData.pickupDate} ${reservationData.pickupTime}</p>
          <p><strong>Teslim Tarihi:</strong> ${reservationData.dropDate} ${reservationData.dropTime}</p>
          <p><strong>Alış Yeri:</strong> ${reservationData.pickup}</p>
          <p><strong>Teslim Yeri:</strong> ${reservationData.drop}</p>
        </div>

        <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Ödeme Bilgileri</h3>
          <p><strong>Toplam Tutar:</strong> ${reservationData.totalPrice} TL</p>
          <p><strong>Ödeme Durumu:</strong>  Onaylandı</p>
          ${reservationData.extraDriver ? '<p><strong>Ek Sürücü:</strong>  Dahil</p>' : ''}
          ${reservationData.insurance ? '<p><strong>Sigorta:</strong>  Dahil</p>' : ''}
        </div>

        <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4> Önemli Bilgiler:</h4>
          <ul>
            <li>Araç teslim alırken geçerli ehliyet ve kimlik belgenizi yanınızda bulundurun</li>
            <li>Teslim alma saatinize lütfen 15 dakika öncesinden gelin</li>
            <li>Herhangi bir sorunuz için +90 555 123 45 67 numarasından bize ulaşabilirsiniz</li>
          </ul>
        </div>

        <p style="text-align: center; color: #666;">
          İyi yolculuklar dileriz! <br>
          <strong>HappyWays Ekibi</strong>
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email başarıyla gönderildi:', userEmail);
    return true;
  } catch (error) {
    console.error('Email gönderim hatası:', error);
    return false;
  }
}

export default sendReservationEmail;