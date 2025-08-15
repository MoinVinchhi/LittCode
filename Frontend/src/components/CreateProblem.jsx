import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import axiosClient from '../utils/axiosClient';
import ErrorBox from './ErrorBox';
import SuccessBox from './SuccessBox';

const problemSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    difficulty: z.enum(['Easy', 'Medium', 'Hard']),
    tags: z.enum(['Array', 'LinkedList', 'Graph', 'DP', 'Numbers']),
    visibleTestCases: z.array(
        z.object({
            input: z.string().min(1, 'Input is required'),
            output: z.string().min(1, 'Output is required'),
            explanation: z.string().min(1, 'Explanation is required')
        })
    ).min(1, 'At least one visible test case required'),
    hiddenTestCases: z.array(
        z.object({
            input: z.string().min(1, 'Input is required'),
            output: z.string().min(1, 'Output is required')
        })
    ).min(1, 'At least one hidden test case required'),
    startCode: z.array(
        z.object({
            language: z.enum(['C++', 'Java', 'JavaScript']),
            initialCode: z.string().min(1, 'Initial code is required')
        })
    ).min(3, 'All three languages required'),
    referenceSolution: z.array(
        z.object({
            language: z.enum(['C++', 'Java', 'JavaScript']),
            completeCode: z.string().min(1, 'complete code is required')
        })
    ).min(3, 'All three languages required')
});

function CreateProblem() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(problemSchema),
        defaultValues: {
            startCode: [
                { language: 'C++', initialCode: '' },
                { language: 'Java', initialCode: '' },
                { language: 'JavaScript', initialCode: '' }
            ],
            referenceSolution: [
                { language: 'C++', completeCode: '' },
                { language: 'Java', completeCode: '' },
                { language: 'JavaScript', completeCode: '' }
            ]
        }
    });

    const {
        fields: visibleFields,
        append: appendVisible,
        remove: removeVisible
    } = useFieldArray({
        control,
        name: 'visibleTestCases'
    });
    
    const {
        fields: hiddenFields,
        append: appendHidden,
        remove: removeHidden
    } = useFieldArray({
        control,
        name: 'hiddenTestCases'
    });

    const onSubmit = async (data) => {
        try {
            setError(null);
            
            // Additional client-side validation
            if (!data.title?.trim()) {
                if (window.popupManager) {
                    window.popupManager.showValidationError('Problem title is required');
                }
                return;
            }
            
            if (!data.description?.trim()) {
                if (window.popupManager) {
                    window.popupManager.showValidationError('Problem description is required');
                }
                return;
            }
            
            if (!data.visibleTestCases || data.visibleTestCases.length === 0) {
                if (window.popupManager) {
                    window.popupManager.showValidationError('At least one visible test case is required');
                }
                return;
            }
            
            if (!data.hiddenTestCases || data.hiddenTestCases.length === 0) {
                if (window.popupManager) {
                    window.popupManager.showValidationError('At least one hidden test case is required');
                }
                return;
            }
            
            // Validate that all code templates are provided
            const requiredLanguages = ['C++', 'Java', 'JavaScript'];
            const missingStartCode = requiredLanguages.filter(lang => 
                !data.startCode.find(sc => sc.language === lang && sc.initialCode?.trim())
            );
            
            if (missingStartCode.length > 0) {
                if (window.popupManager) {
                    window.popupManager.showValidationError(`Starter code is missing for: ${missingStartCode.join(', ')}`);
                }
                return;
            }
            
            const missingRefCode = requiredLanguages.filter(lang => 
                !data.referenceSolution.find(rs => rs.language === lang && rs.completeCode?.trim())
            );
            
            if (missingRefCode.length > 0) {
                if (window.popupManager) {
                    window.popupManager.showValidationError(`Reference solution is missing for: ${missingRefCode.join(', ')}`);
                }
                return;
            }

            await axiosClient.post('/problem/create', data);
            // Success popup is shown by PopupManager
            setTimeout(() => {
                navigate('/');
            }, 2000);
        }
        catch (error) {
            console.error('Error creating problem:', error);
            setError(error.response?.data?.message || error.message || 'Failed to create problem');
            // Error popup is handled by axiosClient interceptor
        }
    };

    return (
        <div className='min-h-screen bg-base-100'>
            <div className='container mx-auto max-w-6xl p-6'>
                
                {/* Header */}
                <div className='text-center mb-8'>
                    <h1 className='text-3xl font-bold text-base-content mb-2'>Create New Problem</h1>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="mb-6">
                        <ErrorBox 
                            error={error} 
                            onClose={() => setError(null)}
                            variant="error"
                        />
                    </div>
                )}



                <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>

                    {/* Basic Information */}
                    <div className='card bg-base-200 shadow-lg border border-base-300'>
                        <div className='card-body'>
                            <h2 className='card-title text-xl text-base-content mb-6'>
                                Basic Information
                            </h2>

                            <div className='space-y-6'>    
                                <div className='form-control'>
                                    <label className='label'>
                                        <span className='label-text font-medium text-base-content w-40'>Problem Title</span>
                                    </label>
                                    <input 
                                        {...register('title')}
                                        placeholder="Enter problem title..."
                                        className={`input input-bordered bg-base-100 ${errors.title ? 'input-error' : 'focus:border-primary'}`}
                                    />
                                    {errors.title && (
                                        <label className='label'>
                                            <span className='label-text-alt text-error'>{errors.title.message}</span>
                                        </label>
                                    )}
                                </div>

                                <div className='form-control'>
                                    <label className='label'>
                                        <span className='label-text font-medium text-base-content w-40'>Problem Description</span>
                                    </label>
                                    <textarea
                                        {...register('description')}
                                        placeholder="Describe the problem in detail..."
                                        className={`textarea textarea-bordered bg-base-100 h-32 resize-none ${errors.description ? 'textarea-error' : 'focus:border-primary'}`}
                                    />
                                    {errors.description && (
                                        <label className='label'>
                                            <span className='label-text-alt text-error'>{errors.description.message}</span>
                                        </label>
                                    )}
                                </div>

                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    <div className='form-control'>
                                        <label className='label'>
                                            <span className='label-text font-medium text-base-content w-40'>Difficulty Level</span>
                                        </label>
                                        <select 
                                            {...register('difficulty')}
                                            className={`select select-bordered bg-base-100 ${errors.difficulty ? 'select-error' : 'focus:border-primary'}`}
                                        >
                                            <option value="">Select difficulty...</option>
                                            <option value="Easy">Easy</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Hard">Hard</option>
                                        </select>
                                        {errors.difficulty && (
                                            <label className='label'>
                                                <span className='label-text-alt text-error'>{errors.difficulty.message}</span>
                                            </label>
                                        )}
                                    </div>

                                    <div className='form-control'>
                                        <label className='label'>
                                            <span className='label-text font-medium text-base-content w-30'>Problem Tag</span>
                                        </label>
                                        <select 
                                            {...register('tags')}
                                            className={`select select-bordered bg-base-100 ${errors.tags ? 'select-error' : 'focus:border-primary'}`}
                                        >
                                            <option value="">Select category...</option>
                                            <option value="Array">Array</option>
                                            <option value="LinkedList">Linked List</option>
                                            <option value="Graph">Graph</option>
                                            <option value="DP">Dynamic Programming</option>
                                            <option value="Numbers">Numbers</option>
                                        </select>
                                        {errors.tags && (
                                            <label className='label'>
                                                <span className='label-text-alt text-error'>{errors.tags.message}</span>
                                            </label>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Test Cases */}
                    <div className='card bg-base-200 shadow-lg border border-base-300'>
                        <div className='card-body'>
                            <h2 className='card-title text-xl text-base-content mb-6'>
                                Test Cases
                            </h2>

                            {/* Visible Test Cases */}
                            <div className='mb-8'>
                                <div className='flex justify-between items-center mb-4'>
                                    <h3 className='text-lg font-semibold text-base-content'>Visible Test Cases</h3>
                                    <button
                                        type='button'
                                        onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                                        className='btn btn-primary btn-sm'
                                    >
                                        Add Visible Case
                                    </button>
                                </div>

                                <div className='space-y-4'>
                                    {visibleFields.map((field, index) => (
                                        <div key={field.id} className='card bg-base-100 border border-base-300 shadow-sm'>
                                            <div className='card-body p-4'>
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className="text-sm font-medium text-base-content">Test Case {index + 1}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeVisible(index)}
                                                        className="btn btn-error btn-xs"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>

                                                <div className='space-y-3'>
                                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                                                        <div className='form-control'>
                                                            <label className='label py-1'>
                                                                <span className='label-text text-sm font-medium w-25'>Input</span>
                                                            </label>
                                                            <input
                                                                {...register(`visibleTestCases.${index}.input`)}
                                                                placeholder="e.g., [1,2,3,4]"
                                                                className="input input-bordered input-sm bg-base-100"
                                                            />
                                                        </div>
                                                        
                                                        <div className='form-control'>
                                                            <label className='label py-1'>
                                                                <span className='label-text text-sm font-medium w-32'>Expected Output</span>
                                                            </label>
                                                            <input
                                                                {...register(`visibleTestCases.${index}.output`)}
                                                                placeholder="e.g., [4,3,2,1]"
                                                                className="input input-bordered input-sm bg-base-100"
                                                            />
                                                        </div>
                                                    </div>
                                                    
                                                    <div className='form-control'>
                                                        <label className='label py-1'>
                                                            <span className='label-text text-sm font-medium w-25'>Explanation</span>
                                                        </label>
                                                        <input
                                                            {...register(`visibleTestCases.${index}.explanation`)}
                                                            placeholder="Explain the logic behind this test case..."
                                                            className="input input-bordered input-sm bg-base-100"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Hidden Test Cases */}
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-base-content">Hidden Test Cases</h3>
                                    <button
                                        type="button"
                                        onClick={() => appendHidden({ input: '', output: '' })}
                                        className="btn btn-primary btn-sm"
                                    >
                                        Add Hidden Case
                                    </button>
                                </div>
                                
                                <div className='space-y-4'>
                                    {hiddenFields.map((field, index) => (
                                        <div key={field.id} className="card bg-base-100 border border-base-300 shadow-sm">
                                            <div className='card-body p-4'>
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className="text-sm font-medium text-base-content">Hidden Case {index + 1}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeHidden(index)}
                                                        className="btn btn-error btn-xs"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                                
                                                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                                                    <div className='form-control'>
                                                        <label className='label py-1'>
                                                            <span className='label-text text-sm font-medium w-25'>Input</span>
                                                        </label>
                                                        <input
                                                            {...register(`hiddenTestCases.${index}.input`)}
                                                            placeholder="e.g., [5,6,7,8]"
                                                            className="input input-bordered input-sm bg-base-100"
                                                        />
                                                    </div>
                                                    
                                                    <div className='form-control'>
                                                        <label className='label py-1'>
                                                            <span className='label-text text-sm font-medium w-32'>Expected Output</span>
                                                        </label>
                                                        <input
                                                            {...register(`hiddenTestCases.${index}.output`)}
                                                            placeholder="e.g., [8,7,6,5]"
                                                            className="input input-bordered input-sm bg-base-100"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Code Templates */}
                    <div className="card bg-base-200 shadow-lg border border-base-300">
                        <div className='card-body'>
                            <h2 className="card-title text-xl text-base-content mb-6">
                                Code Templates
                            </h2>
                            
                            <div className="space-y-6">
                                {[0, 1, 2].map((index) => {
                                    const languages = ['C++', 'Java', 'JavaScript'];
                                    return (
                                        <div key={index} className="card bg-base-100 border border-base-300 shadow-sm">
                                            <div className='card-body p-6'>
                                                <h3 className="text-lg font-semibold text-base-content mb-4">
                                                    {languages[index]}
                                                </h3>
                                                
                                                <div className="grid lg:grid-cols-2 gap-6">
                                                    <div className="form-control">
                                                        <label className="label">
                                                            <span className="label-text font-medium text-base-content mb-2">Starter Code Template</span>
                                                        </label>
                                                        <div className="bg-base-300 p-4 rounded-lg border border-base-300">
                                                            <textarea
                                                                {...register(`startCode.${index}.initialCode`)}
                                                                placeholder={`Write starter code for ${languages[index]}`}
                                                                className="w-full bg-transparent font-mono text-sm resize-none text-base-content focus:outline-none"
                                                                rows={8}
                                                            />
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="form-control">
                                                        <label className="label">
                                                            <span className="label-text font-medium text-base-content mb-2">Reference Solution</span>
                                                        </label>
                                                        <div className="bg-base-300 p-4 rounded-lg border border-base-300">
                                                            <textarea
                                                                {...register(`referenceSolution.${index}.completeCode`)}
                                                                placeholder={`Write complete solution for ${languages[index]}`}
                                                                className="w-full bg-transparent font-mono text-sm resize-none text-base-content focus:outline-none"
                                                                rows={8}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className='flex justify-center pt-4'>
                        <button type="submit" className="btn btn-primary btn-lg px-8">
                            Create Problem
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}

export default CreateProblem;