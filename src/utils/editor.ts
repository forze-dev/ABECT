import { lexicalEditor } from '@payloadcms/richtext-lexical'
import {
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  InlineCodeFeature,
  
  HeadingFeature,
  ParagraphFeature,
  
  UnorderedListFeature,
  OrderedListFeature,
  ChecklistFeature,
  
  BlockquoteFeature,
  HorizontalRuleFeature,
  
  AlignFeature,
  IndentFeature,
  
  LinkFeature,
  UploadFeature,
  
  EXPERIMENTAL_TableFeature,
  
  FixedToolbarFeature,
  InlineToolbarFeature,
  
  HTMLConverterFeature,
} from '@payloadcms/richtext-lexical'

export const fullRichEditor = lexicalEditor({
  admin: {
    hideGutter: true, // <- ГЛОБАЛЬНО убирает плюсики для всех полей
  },
  features: () => [
    FixedToolbarFeature(),
    InlineToolbarFeature(),
    
    HeadingFeature({
      enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    }),
    
    ParagraphFeature(),
    BoldFeature(),
    ItalicFeature(),
    UnderlineFeature(),
    StrikethroughFeature(),
    SubscriptFeature(),
    SuperscriptFeature(),
    InlineCodeFeature(),
    
    UnorderedListFeature(),
    OrderedListFeature(),
    ChecklistFeature(),
    
    BlockquoteFeature(),
    HorizontalRuleFeature(),
    
    AlignFeature(),
    IndentFeature(),
    
    LinkFeature({}),
    UploadFeature({}),
    
    EXPERIMENTAL_TableFeature(),
    
    HTMLConverterFeature({}),
  ],
})