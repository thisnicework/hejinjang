import React, { useState } from 'react';
import { urlFor } from '../sanity';

export default function PageRenderer({ data }) {
  if (!data || !data.sections) return null;

  return (
    <div className="content-page works-detail-page" style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      {data.sections.map((section, idx) => (
        <SectionItem key={section._key || idx} section={section} />
      ))}
    </div>
  );
}

function SectionItem({ section }) {
  switch (section._type) {
    case 'heading': {
      const Level = `h${section.level || 1}`;
      const fontSize = section.level === 1 ? '24px' : section.level === 2 ? '20px' : '17px';
      return (
        <Level style={{ fontSize, fontWeight: 'bold', marginBottom: '20px' }}>
          {nl2br(section.content)}
        </Level>
      );
    }

    case 'text':
    case 'textSection':
      return (
        <p style={{ fontSize: '15px', textAlign: 'justify', marginBottom: '24px', lineHeight: '1.6' }}>
          {nl2br(section.content)}
        </p>
      );

    case 'quote':
      return (
        <p style={{ fontStyle: 'italic', fontSize: '15px', marginBottom: '24px' }}>
          {nl2br(section.content)}
          {section.attribution && <><br />{section.attribution}</>}
        </p>
      );

    case 'credits':
      return (
        <p style={{ fontSize: '15px', marginBottom: '40px', lineHeight: '1.6' }}>
          {nl2br(section.content)}
        </p>
      );

    case 'image':
    case 'imageSection': {
      const src = section.imageSrc || (section.asset && urlFor(section.asset).url()) || section.src;
      return (
        <div className="about-image-container" style={{ marginBottom: '24px' }}>
          <img 
            src={src} 
            style={{ width: '100%', maxWidth: '100%', height: 'auto', display: 'block' }} 
            alt={section.alt || 'Image'} 
            loading="lazy" 
          />
        </div>
      );
    }

    case 'video':
      return (
        <div style={{ marginBottom: '40px', position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%' }}>
          <iframe 
            src={section.src} 
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} 
            frameBorder="0" 
            allow="autoplay; encrypted-media" 
            allowFullScreen
          ></iframe>
        </div>
      );

    case 'link':
      return (
        <p style={{ fontSize: '15px', marginBottom: '24px' }}>
          <a 
            href={section.href || '#'} 
            target={section.target || '_blank'} 
            rel="noopener noreferrer" 
            style={{ textDecoration: 'underline', color: '#1a1a1a' }}
          >
            {section.content || 'Link'}
          </a>
        </p>
      );

    case 'accordion':
      return <AccordionSection section={section} />;

    case 'htmlSection':
      return (
        <div dangerouslySetInnerHTML={{ __html: section.content }} />
      );

    default:
      return null;
  }
}

function AccordionSection({ section }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ marginBottom: '20px' }}>
      <button 
        className="accordion-toggle" 
        style={{ 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer', 
          fontSize: '16px', 
          fontWeight: 'bold', 
          color: '#1a1a1a', 
          padding: '10px 0', 
          borderBottom: '1px solid #1a1a1a', 
          width: '100%', 
          textAlign: 'left' 
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {section.label || '한국어 보기 +'} {isOpen ? '-' : '+'}
      </button>
      <div 
        className="accordion-content" 
        style={{ 
          display: isOpen ? 'block' : 'none', 
          padding: '20px 0' 
        }}
      >
        {(section.children || []).map((child, idx) => (
          <SectionItem key={child._key || idx} section={child} />
        ))}
      </div>
    </div>
  );
}

function nl2br(str) {
  if (!str) return '';
  return str.split('\n').map((line, idx) => (
    <React.Fragment key={idx}>
      {line}
      {idx < str.split('\n').length - 1 && <br />}
    </React.Fragment>
  ));
}
