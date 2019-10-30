//; -*- mode: rjsx;-*-
import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';

import { Button } from './base-components';
import FormField from './form-field';
import Notification from './notification';
import OpencastAPI from '../opencast-api';

function UploadSettings(props) {
  const { t } = useTranslation();
  const [settings, updateSettings] = useState({ ...props.uploadSettings });
  const [error, setError] = useState();

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    updateSettings({ ...settings, [name]: value });
  }

  async function handleSubmit(event) {
    try {
      const ocUploader = new OpencastAPI({ ...settings });
      if (await ocUploader.checkConnection()) {
        props.updateUploadSettings(settings);
      } else {
        setError(t('upload-settings-validation-error'));
      }
    } catch (error) {
      setError(t('message-server-unreachable'));
      console.error(error);
    }
  }

  return (
    <div className={props.className}>
      <header>
        <h1>{t('upload-settings-modal-header')}</h1>
      </header>

      <main>
        {error && <Notification isDanger>{error}</Notification>}

        <FormField label={t('upload-settings-label-server-url')}>
          <input
            name="serverUrl"
            value={settings.serverUrl}
            onChange={handleInputChange}
            className="input"
            type="text"
            autoComplete="off"
          />
        </FormField>

        <FormField label={t('upload-settings-label-workflow-id')}>
          <input
            name="workflowId"
            value={settings.workflowId}
            onChange={handleInputChange}
            className="input"
            type="text"
            autoComplete="off"
          />
        </FormField>

        <FormField label={t('upload-settings-label-username')}>
          <input
            name="loginName"
            value={settings.loginName}
            onChange={handleInputChange}
            className="input"
            type="text"
            autoComplete="off"
          />
        </FormField>

        <FormField label={t('upload-settings-label-password')}>
          <input
            name="loginPassword"
            value={settings.loginPassword}
            onChange={handleInputChange}
            className="input"
            type="password"
            autoComplete="off"
          />
        </FormField>
      </main>

      <footer>
        <Button variant="primary" onClick={handleSubmit}>
          {t('upload-settings-button-validate')}
        </Button>
      </footer>
    </div>
  );
}

const UploadSettingsDialog = styled(UploadSettings)`
  footer {
    margin-top: 1.5em;
  }

  header h1 {
    font-weight: 300;
  }

  .field:not(:last-child) {
    margin-bottom: 0.75rem;
  }

  .control {
    box-sizing: border-box;
    clear: both;
    font-size: 1rem;
    position: relative;
    text-align: left;
  }

  .label {
    color: #363636;
    display: block;
    font-size: 1rem;
    font-weight: 700;
  }

  .label:not(:last-child) {
    margin-bottom: 0.5em;
  }

  input {
    width: 100%;
  }
`;
export default UploadSettingsDialog;
