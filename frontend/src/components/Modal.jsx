import React from 'react';

export default function Modal({ open, icon, title, subtitle, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel', confirmClass = 'btn-primary' }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-card glass" onClick={e => e.stopPropagation()}>
        {icon && <div className="modal-icon">{icon}</div>}
        <h3 className="modal-title">{title}</h3>
        {subtitle && <p className="modal-sub">{subtitle}</p>}
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onCancel}>{cancelText}</button>
          <button className={`btn ${confirmClass}`} onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}
