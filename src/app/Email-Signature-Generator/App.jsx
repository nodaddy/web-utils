'use client';

import { useState } from 'react';

export default function EmailSignatureGenerator() {
  // State for form fields
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    company: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    linkedin: '',
    twitter: '',
    instagram: '',
    selectedTemplate: 'simple',
    primaryColor: '#0f766e', // Default teal color
    showAvatar: false,
    avatarUrl: '',
  });

  // State for the copied notification
  const [copied, setCopied] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle copying to clipboard
  const copyToClipboard = () => {
    const signatureElement = document.getElementById('signature-preview');
    
    if (signatureElement) {
      const range = document.createRange();
      range.selectNode(signatureElement);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      document.execCommand('copy');
      window.getSelection().removeAllRanges();
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Templates for email signatures
  const renderSelectedTemplate = () => {
    const {
      name,
      position,
      company,
      phone,
      email,
      website,
      address,
      linkedin,
      twitter,
      instagram,
      primaryColor,
      showAvatar,
      avatarUrl,
    } = formData;

    const defaultAvatar = "https://via.placeholder.com/80";

    switch (formData.selectedTemplate) {
      case 'simple':
        return (
          <div className="p-4 border rounded" style={{ fontFamily: 'Arial, sans-serif' }}>
            <table cellPadding="0" cellSpacing="0">
              <tbody>
                <tr>
                  {showAvatar && (
                    <td valign="top" style={{ paddingRight: '15px' }}>
                      <img 
                        src={avatarUrl || defaultAvatar} 
                        alt="Profile" 
                        width="80" 
                        height="80" 
                        style={{ borderRadius: '50%' }} 
                      />
                    </td>
                  )}
                  <td>
                    <table cellPadding="0" cellSpacing="0">
                      <tbody>
                        <tr>
                          <td>
                            <p style={{ margin: '0', fontWeight: 'bold', fontSize: '16px', color: primaryColor }}>
                              {name || "Your Name"}
                            </p>
                          </td>
                        </tr>
                        {position && (
                          <tr>
                            <td>
                              <p style={{ margin: '0', fontSize: '14px', color: '#4b5563' }}>
                                {position}
                              </p>
                            </td>
                          </tr>
                        )}
                        {company && (
                          <tr>
                            <td>
                              <p style={{ margin: '0', fontSize: '14px', color: '#4b5563' }}>
                                {company}
                              </p>
                            </td>
                          </tr>
                        )}
                        <tr>
                          <td height="10"></td>
                        </tr>
                        {(phone || email || website || address) && (
                          <tr>
                            <td>
                              <table cellPadding="0" cellSpacing="0">
                                <tbody>
                                  {phone && (
                                    <tr>
                                      <td style={{ paddingRight: '8px', color: primaryColor }}>📱</td>
                                      <td style={{ fontSize: '13px', color: '#4b5563' }}>{phone}</td>
                                    </tr>
                                  )}
                                  {email && (
                                    <tr>
                                      <td style={{ paddingRight: '8px', color: primaryColor }}>✉️</td>
                                      <td style={{ fontSize: '13px', color: '#4b5563' }}>
                                        <a href={`mailto:${email}`} style={{ color: '#4b5563', textDecoration: 'none' }}>
                                          {email}
                                        </a>
                                      </td>
                                    </tr>
                                  )}
                                  {website && (
                                    <tr>
                                      <td style={{ paddingRight: '8px', color: primaryColor }}>🌐</td>
                                      <td style={{ fontSize: '13px', color: '#4b5563' }}>
                                        <a href={website.startsWith('http') ? website : `https://${website}`} style={{ color: '#4b5563', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
                                          {website.replace(/^https?:\/\//i, '')}
                                        </a>
                                      </td>
                                    </tr>
                                  )}
                                  {address && (
                                    <tr>
                                      <td style={{ paddingRight: '8px', color: primaryColor }}>📍</td>
                                      <td style={{ fontSize: '13px', color: '#4b5563' }}>{address}</td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        )}
                        {(linkedin || twitter || instagram) && (
                          <>
                            <tr>
                              <td height="10"></td>
                            </tr>
                            <tr>
                              <td>
                                <table cellPadding="0" cellSpacing="0">
                                  <tbody>
                                    <tr>
                                      {linkedin && (
                                        <td style={{ paddingRight: '8px' }}>
                                          <a href={linkedin.startsWith('http') ? linkedin : `https://linkedin.com/in/${linkedin}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                            <span style={{ fontSize: '16px' }}>🔗</span>
                                          </a>
                                        </td>
                                      )}
                                      {twitter && (
                                        <td style={{ paddingRight: '8px' }}>
                                          <a href={twitter.startsWith('http') ? twitter : `https://twitter.com/${twitter}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                            <span style={{ fontSize: '16px' }}>🐦</span>
                                          </a>
                                        </td>
                                      )}
                                      {instagram && (
                                        <td>
                                          <a href={instagram.startsWith('http') ? instagram : `https://instagram.com/${instagram}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                            <span style={{ fontSize: '16px' }}>📸</span>
                                          </a>
                                        </td>
                                      )}
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );

      case 'modern':
        return (
          <div className="p-4 border rounded" style={{ fontFamily: 'Arial, sans-serif' }}>
            <table cellPadding="0" cellSpacing="0">
              <tbody>
                <tr>
                  {showAvatar && (
                    <td valign="middle" style={{ paddingRight: '15px' }}>
                      <img 
                        src={avatarUrl || defaultAvatar} 
                        alt="Profile" 
                        width="80" 
                        height="80" 
                        style={{ borderRadius: '8px' }} 
                      />
                    </td>
                  )}
                  <td>
                    <table cellPadding="0" cellSpacing="0">
                      <tbody>
                        <tr>
                          <td>
                            <p style={{ margin: '0', fontWeight: 'bold', fontSize: '18px', color: primaryColor }}>
                              {name || "Your Name"}
                            </p>
                          </td>
                        </tr>
                        {position && (
                          <tr>
                            <td>
                              <p style={{ margin: '0', fontSize: '14px', color: '#4b5563' }}>
                                {position} {company && `| ${company}`}
                              </p>
                            </td>
                          </tr>
                        )}
                        <tr>
                          <td height="10"></td>
                        </tr>
                        <tr>
                          <td>
                            <div style={{ height: '2px', width: '50px', backgroundColor: primaryColor, margin: '5px 0' }}></div>
                          </td>
                        </tr>
                        <tr>
                          <td height="10"></td>
                        </tr>
                        {(phone || email || website || address) && (
                          <tr>
                            <td>
                              <table cellPadding="0" cellSpacing="0">
                                <tbody>
                                  <tr>
                                    {phone && (
                                      <td style={{ paddingRight: '12px' }}>
                                        <a href={`tel:${phone}`} style={{ textDecoration: 'none', color: primaryColor }}>
                                          <span style={{ fontSize: '16px' }}>📱</span>
                                        </a>
                                      </td>
                                    )}
                                    {email && (
                                      <td style={{ paddingRight: '12px' }}>
                                        <a href={`mailto:${email}`} style={{ textDecoration: 'none', color: primaryColor }}>
                                          <span style={{ fontSize: '16px' }}>✉️</span>
                                        </a>
                                      </td>
                                    )}
                                    {website && (
                                      <td style={{ paddingRight: '12px' }}>
                                        <a href={website.startsWith('http') ? website : `https://${website}`} style={{ textDecoration: 'none', color: primaryColor }} target="_blank" rel="noopener noreferrer">
                                          <span style={{ fontSize: '16px' }}>🌐</span>
                                        </a>
                                      </td>
                                    )}
                                    {address && (
                                      <td>
                                        <span style={{ fontSize: '16px', color: primaryColor }}>📍</span>
                                      </td>
                                    )}
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        )}
                        {(linkedin || twitter || instagram) && (
                          <tr>
                            <td height="15"></td>
                          </tr>
                        )}
                        {(linkedin || twitter || instagram) && (
                          <tr>
                            <td>
                              <table cellPadding="0" cellSpacing="0">
                                <tbody>
                                  <tr>
                                    {linkedin && (
                                      <td style={{ paddingRight: '12px' }}>
                                        <a href={linkedin.startsWith('http') ? linkedin : `https://linkedin.com/in/${linkedin}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: primaryColor }}>
                                          <span style={{ fontSize: '16px' }}>🔗</span>
                                        </a>
                                      </td>
                                    )}
                                    {twitter && (
                                      <td style={{ paddingRight: '12px' }}>
                                        <a href={twitter.startsWith('http') ? twitter : `https://twitter.com/${twitter}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: primaryColor }}>
                                          <span style={{ fontSize: '16px' }}>🐦</span>
                                        </a>
                                      </td>
                                    )}
                                    {instagram && (
                                      <td>
                                        <a href={instagram.startsWith('http') ? instagram : `https://instagram.com/${instagram}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: primaryColor }}>
                                          <span style={{ fontSize: '16px' }}>📸</span>
                                        </a>
                                      </td>
                                    )}
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );

      case 'compact':
        return (
          <div className="p-4 border rounded" style={{ fontFamily: 'Arial, sans-serif' }}>
            <table cellPadding="0" cellSpacing="0">
              <tbody>
                <tr>
                  <td>
                    <table cellPadding="0" cellSpacing="0">
                      <tbody>
                        <tr>
                          <td>
                            <table cellPadding="0" cellSpacing="0">
                              <tbody>
                                <tr>
                                  {showAvatar && (
                                    <td style={{ verticalAlign: 'middle', paddingRight: '10px' }}>
                                      <img 
                                        src={avatarUrl || defaultAvatar} 
                                        alt="Profile" 
                                        width="40" 
                                        height="40" 
                                        style={{ borderRadius: '50%' }} 
                                      />
                                    </td>
                                  )}
                                  <td style={{ verticalAlign: 'middle' }}>
                                    <p style={{ margin: '0', fontWeight: 'bold', fontSize: '16px', color: primaryColor }}>
                                      {name || "Your Name"}
                                    </p>
                                    {position && (
                                      <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
                                        {position} {company && `• ${company}`}
                                      </p>
                                    )}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td height="8"></td>
                        </tr>
                        <tr>
                          <td>
                            <table cellPadding="0" cellSpacing="0">
                              <tbody>
                                <tr>
                                  {phone && (
                                    <td style={{ paddingRight: '10px', fontSize: '12px' }}>
                                      <a href={`tel:${phone}`} style={{ textDecoration: 'none', color: '#4b5563' }}>
                                        <span style={{ color: primaryColor, paddingRight: '2px' }}>📱</span> {phone}
                                      </a>
                                    </td>
                                  )}
                                  {email && (
                                    <td style={{ paddingRight: '10px', fontSize: '12px' }}>
                                      <a href={`mailto:${email}`} style={{ textDecoration: 'none', color: '#4b5563' }}>
                                        <span style={{ color: primaryColor, paddingRight: '2px' }}>✉️</span> {email}
                                      </a>
                                    </td>
                                  )}
                                  {website && (
                                    <td style={{ fontSize: '12px' }}>
                                      <a href={website.startsWith('http') ? website : `https://${website}`} style={{ textDecoration: 'none', color: '#4b5563' }} target="_blank" rel="noopener noreferrer">
                                        <span style={{ color: primaryColor, paddingRight: '2px' }}>🌐</span> {website.replace(/^https?:\/\//i, '')}
                                      </a>
                                    </td>
                                  )}
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        {address && (
                          <tr>
                            <td style={{ fontSize: '12px', color: '#4b5563', paddingTop: '3px' }}>
                              <span style={{ color: primaryColor, paddingRight: '2px' }}>📍</span> {address}
                            </td>
                          </tr>
                        )}
                        {(linkedin || twitter || instagram) && (
                          <tr>
                            <td style={{ paddingTop: '8px' }}>
                              <table cellPadding="0" cellSpacing="0">
                                <tbody>
                                  <tr>
                                    {linkedin && (
                                      <td style={{ paddingRight: '8px' }}>
                                        <a href={linkedin.startsWith('http') ? linkedin : `https://linkedin.com/in/${linkedin}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                          <span style={{ fontSize: '14px', color: primaryColor }}>🔗</span>
                                        </a>
                                      </td>
                                    )}
                                    {twitter && (
                                      <td style={{ paddingRight: '8px' }}>
                                        <a href={twitter.startsWith('http') ? twitter : `https://twitter.com/${twitter}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                          <span style={{ fontSize: '14px', color: primaryColor }}>🐦</span>
                                        </a>
                                      </td>
                                    )}
                                    {instagram && (
                                      <td>
                                        <a href={instagram.startsWith('http') ? instagram : `https://instagram.com/${instagram}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                          <span style={{ fontSize: '14px', color: primaryColor }}>📸</span>
                                        </a>
                                      </td>
                                    )}
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">✉️ Email Signature Generator</h1>
          <p className="mt-2 text-lg text-gray-600">
            Create a professional email signature in seconds
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Information</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                  Position / Title
                </label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border"
                  placeholder="Marketing Manager"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border"
                  placeholder="Acme Inc."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border"
                    placeholder="john.doe@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                  Website
                </label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border"
                  placeholder="www.example.com"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border"
                  placeholder="123 Business St., City, Country"
                />
              </div>

              <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">Social Media</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                    LinkedIn
                  </label>
                  <input
                    type="text"
                    id="linkedin"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border"
                    placeholder="username"
                  />
                </div>

                <div>
                  <label htmlFor="twitter" className="block text-sm font-medium text-gray-700">
                    Twitter
                  </label>
                  <input
                    type="text"
                    id="twitter"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border"
                    placeholder="username"
                  />
                </div>

                <div>
                  <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">
                    Instagram
                  </label>
                  <input
                    type="text"
                    id="instagram"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border"
                    placeholder="username"
                  />
                </div>
              </div>

              <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">Appearance</h3>
              
              <div>
                <label htmlFor="selectedTemplate" className="block text-sm font-medium text-gray-700">
                  Template Style
                </label>
                <select
                  id="selectedTemplate"
                  name="selectedTemplate"
                  value={formData.selectedTemplate}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md border"
                >
                  <option value="simple">Simple</option>
                  <option value="modern">Modern</option>
                  <option value="compact">Compact</option>
                </select>
              </div>

              <div>
                <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700">
                  Primary Color
                </label>
                <input
                  type="color"
                  id="primaryColor"
                  name="primaryColor"
                  value={formData.primaryColor}
                  onChange={handleChange}
                  className="mt-1 block w-full h-10 p-1 rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm border"
                />
              </div>

              <div className="flex items-center">
                <input
                  id="showAvatar"
                  name="showAvatar"
                  type="checkbox"
                  checked={formData.showAvatar}
                  onChange={handleChange}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label htmlFor="showAvatar" className="ml-2 block text-sm text-gray-700">
                  Include Avatar
                </label>
              </div>

              {formData.showAvatar && (
                <div>
                  <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-700">
                    Avatar URL
                  </label>
                  <input
                    type="text"
                    id="avatarUrl"
                    name="avatarUrl"
                    value={formData.avatarUrl}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border"
                    placeholder="https://example.com/your-image.jpg"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Leave blank to use a placeholder image.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Preview</h2>
            
            <div className="flex-grow bg-gray-50 rounded p-6 mb-4">
              <div id="signature-preview">
                {renderSelectedTemplate()}
              </div>
            </div>
            
            <button
              onClick={copyToClipboard}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
            >
              {copied ? "✓ Copied to Clipboard!" : "Copy Signature"}
            </button>
            
            <div className="mt-4 text-center text-sm text-gray-500">
              <p>
                To use this signature, paste it in your email client's signature settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}