import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  EV_TECH_TOPICS,
  getAllTechTopics,
  getTechTopicById,
  getTechTopicsByPillar
} from '../src/data/evTechKnowledge.ts';
import { getEVModels } from '../src/data/evModels.ts';

describe('Milestone: EV Technology Guide & Contextual Explainers Test Suite', () => {
  const allTopics = getAllTechTopics();
  const evModels = getEVModels();

  describe('1. 4-Pillar Tech Dataset Completeness', () => {
    it('verifies all 4 pillars are populated with detailed engineering topics', () => {
      const pillars = ['charging_ports', 'battery_thermal', 'motor_drivetrain', 'safety_regen'];

      for (const pillar of pillars) {
        const topics = getTechTopicsByPillar(pillar);
        assert.ok(topics.length >= 1, `Pillar ${pillar} must have at least 1 topic, got ${topics.length}`);
      }
    });

    it('ensures every tech topic has non-empty engineering content and Telangana context', () => {
      for (const topic of allTopics) {
        assert.ok(topic.id.startsWith('tech-'), `Topic id must start with tech-: ${topic.id}`);
        assert.ok(topic.title.length > 0, `Missing title: ${topic.id}`);
        assert.ok(topic.subtitle.length > 0, `Missing subtitle: ${topic.id}`);
        assert.ok(topic.shortDefinition.length > 0, `Missing shortDefinition: ${topic.id}`);
        assert.ok(topic.engineeringExplanation.length >= 2, `Expected >= 2 explanation paragraphs: ${topic.id}`);
        assert.ok(topic.telanganaContextNote.length > 0, `Missing telanganaContextNote: ${topic.id}`);
        assert.ok(topic.bulletPoints.length >= 3, `Expected >= 3 bulletPoints: ${topic.id}`);
        assert.ok(topic.badgeLabel.length > 0, `Missing badgeLabel: ${topic.id}`);

        if (topic.comparison) {
          assert.ok(topic.comparison.optionA.title.length > 0);
          assert.ok(topic.comparison.optionB.title.length > 0);
          assert.ok(topic.comparison.optionA.prosOrHighlights.length >= 2);
          assert.ok(topic.comparison.optionB.prosOrHighlights.length >= 2);
        }
      }
    });
  });

  describe('2. Mapping to Catalog EV Models', () => {
    it('verifies mapped vehicle model IDs exist in the EV catalog', () => {
      const catalogIds = new Set(evModels.map(m => m.id));

      for (const topic of allTopics) {
        for (const modelId of topic.exampleVehicleModelIds) {
          assert.ok(
            catalogIds.has(modelId),
            `Topic ${topic.id} references non-existent catalog vehicle: ${modelId}`
          );
        }
      }
    });

    it('verifies retrieval helper functions', () => {
      const obcTopic = getTechTopicById('tech-onboard-charger');
      assert.ok(obcTopic);
      assert.strictEqual(obcTopic?.pillar, 'charging_ports');

      const lfpTopic = getTechTopicById('tech-lfp-vs-nmc');
      assert.ok(lfpTopic);
      assert.strictEqual(lfpTopic?.pillar, 'battery_thermal');
    });
  });
});
