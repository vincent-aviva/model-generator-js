import * as fs from 'fs';
import { yellow } from 'colors';
import { format, Options } from 'prettier';
import { commonHelper } from '../../common-helper';
import { textHelper } from '../../text-helper';
import {
    ContentTypeElements,
    ContentTypeModels,
    LanguageModels,
    ProjectModels,
    TaxonomyModels,
    WorkflowModels
} from '@kentico/kontent-management';
import { IGenerateResult } from '../../common-helper';

export class ProjectGenerator {
    generateProjectModel(data: {
        projectInformation: ProjectModels.ProjectInformationModel;
        types: ContentTypeModels.ContentType[];
        languages: LanguageModels.LanguageModel[];
        taxonomies: TaxonomyModels.Taxonomy[];
        workflows: WorkflowModels.Workflow[];
        addTimestamp: boolean;
        formatOptions?: Options;
    }): IGenerateResult {
        const code = this.getProjectModelCode({
            projectInformation: data.projectInformation,
            types: data.types,
            addTimestamp: data.addTimestamp,
            formatOptions: data.formatOptions,
            languages: data.languages,
            taxonomies: data.taxonomies,
            workflows: data.workflows
        });

        this.createFileOnFs(code);

        return {
            filenames: [`./${this.getProjectModelFilename()}`]
        };
    }

    private getProjectComment(projectInformation: ProjectModels.ProjectInformationModel): string {
        let comment: string = `${projectInformation.name}`;

        comment += `\n* Environment: ${projectInformation.environment}`;

        return comment;
    }

    private getContentTypeComment(contentType: ContentTypeModels.ContentType): string {
        let comment: string = `/**`;

        comment += `\n* ${contentType.name}`;
        comment += `\n* Last modified: ${contentType.lastModified}`;
        comment += `\n*/`;

        return comment;
    }

    private getWorkflowComment(workflow: WorkflowModels.Workflow): string {
        let comment: string = `/**`;

        comment += `\n* ${workflow.name}`;
        comment += `\n*/`;

        return comment;
    }

    private getLanguageComment(language: LanguageModels.LanguageModel): string {
        let comment: string = `/**`;

        comment += `\n* ${language.name}`;
        comment += `\n* Is Active: ${language.isActive ? 'true' : 'false'}`;
        comment += `\n* Is Default: ${language.isDefault}`;
        comment += `\n* Fallback language Id: ${language.fallbackLanguage?.id}`;
        comment += `\n*/`;

        return comment;
    }

    private getElementComment(
        element: ContentTypeElements.ContentTypeElementModel,
        taxonomies: TaxonomyModels.Taxonomy[]
    ): string {
        let comment: string = `/**`;
        const guidelines = commonHelper.getElementGuidelines(element);
        const name = commonHelper.getElementTitle(element, taxonomies);

        if (name) {
            comment += `\n* ${name} (${element.type})`;
        }

        if (guidelines) {
            comment += `\n*`;
            comment += `\n* ${guidelines}`;
        }

        comment += `\n*/`;

        return comment;
    }

    private getTaxonomyComment(taxonomy: TaxonomyModels.Taxonomy): string {
        let comment: string = `/**`;

        comment += `\n* ${taxonomy.name}`;
        comment += `\n*/`;

        return comment;
    }

    private getProjectModelCode(data: {
        projectInformation: ProjectModels.ProjectInformationModel;
        types: ContentTypeModels.ContentType[];
        languages: LanguageModels.LanguageModel[];
        taxonomies: TaxonomyModels.Taxonomy[];
        workflows: WorkflowModels.Workflow[];
        addTimestamp: boolean;
        formatOptions?: Options;
    }): string {
        const code = `
/**
* ${commonHelper.getAutogenerateNote(data.addTimestamp)}
*
* ${this.getProjectComment(data.projectInformation)}
*/
export const projectModel = {
    languages: {
        ${this.getProjectLanguages(data.languages)}
    },
    contentTypes: {
        ${this.getProjectContentTypes(data.types, data.taxonomies)}
    },
    taxonomies: {
        ${this.getProjectTaxonomies(data.taxonomies)}
    },
    workflows: {
        ${this.getProjectWorkflows(data.workflows)}
    }
};
`;

        const formatOptions: Options = data.formatOptions
            ? data.formatOptions
            : {
                  parser: 'typescript',
                  singleQuote: true
              };

        // beautify code
        return format(code, formatOptions);
    }

    private getProjectLanguages(languages: LanguageModels.LanguageModel[]): string {
        let code: string = ``;
        for (let i = 0; i < languages.length; i++) {
            const language = languages[i];
            const isLast = i === languages.length - 1;
            code += `\n`;
            code += `${this.getLanguageComment(language)}\n`;
            code += `${textHelper.toAlphanumeric(language.codename)}: {
                codename: '${language.codename}',
                id: '${language.id}',
                externalId: ${language.externalId},
                name: '${commonHelper.escapeNameValue(language.name)}'}`;
            code += `${!isLast ? ',\n' : ''}`;
        }

        return code;
    }

    
    private getProjectWorkflows(
        workflows: WorkflowModels.Workflow[]
    ): string {
        let code: string = ``;
        for (let i = 0; i < workflows.length; i++) {
            const workflow = workflows[i];
            const isLast = i === workflows.length - 1;

            code += `\n`;
            code += `${this.getWorkflowComment(workflow)}\n`;
            code += `${workflow.codename}: {
                codename: '${workflow.codename}',
                id: '${workflow.id}',
                name: '${commonHelper.escapeNameValue(workflow.name)}'
            }${!isLast ? ',\n' : ''}`;
        }

        return code;
    }

    private getProjectContentTypes(
        contentTypes: ContentTypeModels.ContentType[],
        taxonomies: TaxonomyModels.Taxonomy[]
    ): string {
        let code: string = ``;
        for (let i = 0; i < contentTypes.length; i++) {
            const contentType = contentTypes[i];
            const isLast = i === contentTypes.length - 1;

            code += `\n`;
            code += `${this.getContentTypeComment(contentType)}\n`;
            code += `${contentType.codename}: {
                codename: '${contentType.codename}',
                id: '${contentType.id}',
                externalId: ${contentType.externalId},
                name: '${commonHelper.escapeNameValue(contentType.name)}',
                elements: {${this.getProjectElements(contentType, taxonomies)}}
            }${!isLast ? ',\n' : ''}`;
        }

        return code;
    }

    private getProjectElements(
        contentType: ContentTypeModels.ContentType,
        taxonomies: TaxonomyModels.Taxonomy[]
    ): string {
        let code: string = '';
        const elementsWithName = contentType.elements.filter((m) => (m as any)['name']);
        for (let i = 0; i < elementsWithName.length; i++) {
            const element = elementsWithName[i];
            const isLast = i === elementsWithName.length - 1;
            const name = (element as any)['name'];

            if (!name) {
                throw Error(`Element '${element.codename}' needs to have a name property`);
            }

            const isRequired = commonHelper.isElementRequired(element);

            code += `\n`;
            code += `${this.getElementComment(element, taxonomies)}\n`;
            code += `${element.codename}: {
                codename: '${element.codename}',
                id: '${element.id}',
                externalId: ${element.external_id},
                name: '${commonHelper.escapeNameValue(name)}',
                required: ${isRequired},
                type: '${element.type}'
            }${!isLast ? ',\n' : ''}`;
        }

        return code;
    }

    private getProjectTaxonomies(taxonomies: TaxonomyModels.Taxonomy[]): string {
        let code: string = ``;
        for (let i = 0; i < taxonomies.length; i++) {
            const taxonomy = taxonomies[i];
            const isLast = i === taxonomies.length - 1;

            code += `\n`;
            code += `${this.getTaxonomyComment(taxonomy)}\n`;
            code += `${taxonomy.codename}: {
                codename: '${taxonomy.codename}',
                id: '${taxonomy.id}',
                externalId: ${taxonomy.externalId},
                name: '${commonHelper.escapeNameValue(taxonomy.name)}',
                ${this.getProjectTaxonomiesTerms(taxonomy.terms)}
            }${!isLast ? ',\n' : ''}`;
        }

        return code;
    }

    private getProjectTaxonomiesTerms(terms: TaxonomyModels.Taxonomy[]): string {
        if (terms.length === 0) {
            return `terms: {}`;
        }

        let code: string = `terms: {`;
        for (let i = 0; i < terms.length; i++) {
            const term = terms[i];
            const isLast = i === terms.length - 1;
            code += `${term.codename}: {
                codename: '${term.codename}',
                id: '${term.id}',
                externalId: ${term.externalId},
                name: '${commonHelper.escapeNameValue(term.name)}',
                ${this.getProjectTaxonomiesTerms(term.terms)}
            }${!isLast ? ',\n' : ''}`;
        }
        code += '}';

        return code;
    }

    private createFileOnFs(code: string): void {
        const classFileName = this.getProjectModelFilename();

        fs.writeFileSync('./' + classFileName, code);

        console.log(`\nProject structure '${yellow(classFileName)}'`);
    }

    private getProjectModelFilename(): string {
        return `_project.ts`;
    }
}

export const projectGenerator = new ProjectGenerator();