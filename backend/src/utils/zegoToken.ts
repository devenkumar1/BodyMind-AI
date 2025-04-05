import crypto from 'crypto'

/**
 * Generate a ZegoCloud token for secure communication
 * 
 * @param {number} appID - The ZegoCloud App ID
 * @param {string} serverSecret - The server secret from ZegoCloud console
 * @param {string} userID - The unique user identifier
 * @param {string} roomID - The room identifier for the meeting
 * @param {number} effectiveTimeInSeconds - Token validity duration in seconds (default 24 hours)
 * @returns {string} - The generated token
 */
function generateZegoToken(appID, serverSecret, userID, roomID, effectiveTimeInSeconds = 3600 * 24) {
  // Current timestamp in seconds
  const createTime = Math.floor(Date.now() / 1000);
  const expireTime = createTime + effectiveTimeInSeconds;

  // Random number for nonce
  const nonce = Math.floor(Math.random() * 2147483647);

  // Payload to be signed
  const payload = {
    app_id: appID,
    user_id: userID,
    room_id: roomID,
    create_time: createTime,
    expire_time: expireTime,
    nonce,
    payload: ''
  };

  // Convert to JSON string
  const payloadString = JSON.stringify(payload);
  
  // Compute signature using HMAC-SHA256
  const hmac = crypto.createHmac('sha256', serverSecret);
  hmac.update(payloadString);
  const signature = hmac.digest('hex');

  // Combine the signature with the payload
  const signedPayload = {
    ...payload,
    signature
  };

  // Encode as Base64
  const token = Buffer.from(JSON.stringify(signedPayload)).toString('base64');
  
  return token;
}

export default generateZegoToken